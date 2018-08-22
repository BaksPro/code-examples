import { createSelector } from 'reselect';
import _ from 'lodash';

const getComputers = state => state.computers.items;

const getGroup = state => state.groups.current;

const filterComputersByGroup = (getComputers, getGroup) => {
    const computers = _.isEmpty(getGroup)
        ? getComputers
        : getComputers.filter(item => item.groupId === getGroup.id);
    return computers;
};

export default createSelector(getComputers, getGroup, filterComputersByGroup);
