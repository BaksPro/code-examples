import * as types from '../constants/action-installer-types';

const defaultState = {
    fetching: false,
    error: '',
    downloadLinkss: [],
    fetchingLink: false,
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case types.FETCHING_INSTALLER__FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.data,
            };
        case types.FETCHING_INSTALLER_SUCCESS:
            return {
                ...state,
                fetching: false,
            };
        case types.FETCHING_LINK_SUCCESS:
            return {
                ...state,
                fetchingLink: false,
                downloadLinks: [
                    ...state.downloadLinks.filter(item => item.groupName !== action.data.groupName),
                    action.data,
                ],
            };

        case types.DECREASE_LINK_INSTALLER_COUNT:
            return {
                ...state,
                downloadLinks: [
                    ...state.downloadLinks.filter(item => item.groupName !== action.data.groupName),
                    {
                        ...state.downloadLinks.find(
                            item => item.groupName === action.data.groupName
                        ),
                        ...action.data,
                    },
                ],
            };

        case types.DELETE_LINK_SUCCESS_IO:
            return {
                ...state,
                fetchingLink: false,
                downloadLinks: state.downloadLinks.filter(item => item.groupId !== action.data),
            };
        case types.FETCHING_LINKS_SUCCESS:
            return {
                ...state,
                fetchingLink: false,
                downloadLinks: action.data,
            };
        case types.FETCHING_LINK_FAILURE:
            return {
                ...state,
                fetchingLink: false,
                link: '',
            };

        case types.FETCHING_INSTALLER_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case types.FETCHING_LINK_REQUEST:
            return {
                ...state,
                fetchingLink: true,
            };
        default:
            return state;
    }
};
