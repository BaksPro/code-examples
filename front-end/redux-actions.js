import axios from 'axios';
import cookie from 'react-cookies';
import * as URL from '../constants/restUrls/services';
import * as types from '../constants/redux-actions/services';
import agentActionTypes from '../constants/agent-action';

axios.defaults.baseURL = __API_URL__;

const generateHeaders = () => ({
    headers: {
        Authorization: cookie.load('token'),
    },
});
export const loadedServices = services => ({
    type: types.LOAD_SERVICES,
    data: services,
});
export const fetchingServicesFailure = err => ({
    type: types.FETCHING_SERVICES,
    err,
});
export const fetchingServices = actionType => ({
    type: types.FETCHING_SERVICES,
    actionType,
});
// action for redux-scokeIo
export const leaveServicesRoom = agentId => dispatch => {
    dispatch({
        type: 'server/schedulingRoomLeave',
        data: agentId,
    });
};

export const joinServicesRoom = agentId => dispatch => {
    dispatch({
        type: 'server/joinServicesRoom',
        data: agentId,
    });
};

export const loadServices = computerId => dispatch => {
    dispatch(fetchingServices('Loading'));
    return axios
        .get(`${URL.REST_URL_LOAD_SERVICES}/${computerId}`, generateHeaders())
        .then(response => {
            dispatch(loadedServices(response.data));
        })
        .catch(err => {
            dispatch(fetchingServicesFailure(err));
            throw err;
        });
};

export const scanServices = (agentID, computerId) => dispatch => {
    dispatch(fetchingServices('Scanning'));
    return (
        axios
            .post(
                URL.REST_URL_ADD_ACTION_SCAN_SERVICES,
                {
                    agentId: agentID,
                    actionType: agentActionTypes.ACTION_AGENT_ISSUES_SCAN_SERVICES,
                    computerId,
                },
                generateHeaders()
            )
            // when successful, redux-socketIo will dispatch action from REST Api endpoint using rooms
            .catch(err => {
                dispatch(fetchingServicesFailure(err));
                throw err;
            })
    );
};

export const changeServices = (agentID, serviceCommand, servicesNames, computerId) => dispatch => {
    dispatch(fetchingServices('Updating'));
    return axios
        .post(
            `${URL.REST_URL_UPDATE_SERVICES}`,
            {
                agentId: agentID,
                actionType: agentActionTypes.ACTION_AGENT_ISSUES_UPDATE_SERVICES,
                serviceCommand,
                servicesNames,
                computerId,
            },
            generateHeaders()
        )
        .catch(err => {
            dispatch(fetchingServicesFailure(err));
            throw err;
        });
};
