import boom from 'boom';
import asyncHandler from 'express-async-handler';
import { Action } from '../../../models';
import * as types from '../../../constants/action-issueSettings-types';
import eventService from '../../../service/events';
import eventTypes from '../../../constants/enums/event';
import { agentActionTypes, pollEventStatus } from '../../../constants/enums/action';

module.exports.statusClean = asyncHandler(async (req, res) => {
    const {
        agentId,
        data: { progress, result },
        actionError,
    } = req.body;
    const io = req.io;
    const { userId, pcName } = res.locals;

    if (actionError) {
        const deleteStatus = await Action.destroy({
            where: {
                agentId,
                status: { $or: ['STATUS_PENDING', 'STATUS_ABORTING'] },
                actionType: agentActionTypes.ACTION_AGENT_ISSUES_CLEAN,
            },
            returning: true,
        });

        if (deleteStatus[0] === 0) {
            throw boom.notFound(`Action type ${agentActionTypes.ACTION_AGENT_ISSUES_SCAN} for agentId ${agentId} don't delete`);
        }

        io.sockets.in(`action${agentId}`).emit('action', {
            type: types.CLEAN_PROGRESS_FAIL,
            data: `Error occurred in cleaner: ${actionError}`,
        });
        io.sockets.in(userId).emit('action', { type: types.ACTION_DATA_LOAD_IO_END, data: { agentId } });
        res.json({ messages: 'Error updated' });
    } else {
        const actionDone = await Action.update(
            {
                data: result,
                status: 'STATUS_DONE',
                progress,
            },
            {
                where: {
                    agentId,
                    status: { $or: ['STATUS_PENDING', 'STATUS_ABORTING'] },
                    actionType: agentActionTypes.ACTION_AGENT_ISSUES_CLEAN,
                },
                returning: true,
            }
        );

        if (actionDone[0] === 0) {
            throw boom.notFound(`Action   for agentId ${agentId} not update`);
        }

        io.sockets.in(`action${agentId}`).emit('action', {
            type: types.CLEAN_PROGRESS_DONE,
            data: actionDone[1][0].dataValues,
        });
        io.sockets.in(`computerList${actionDone[1][0].userId}`).emit('action', {
            type: types.ACTION_DATA_LOAD_IO_END,
            data: actionDone[1][0].dataValues,
        });

        eventService.createEvent(actionDone[1][0].computerId, userId, pcName, eventTypes.COMPUTER_CLEANED, io, agentId);
        res.json({
            messages: `Action type ${agentActionTypes.ACTION_AGENT_ISSUES_SCAN} for agentId   ${agentId} done`,
        });
    }
});
