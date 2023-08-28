import {SET_DEFAULT_SIDE_NAV, SET_SIDE_NAV} from "../actions/SideNavActions";

const initialState = {
    sideNavSettings: {
        leftSidebar: {
            secondaryNavOpen: false,
        },
    },
    sideNavDefaultSettings: {
        leftSidebar: {
            secondaryNavOpen: false,
        }
    }
};

const SideNavReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SIDE_NAV:
            return {
                ...state,
                sideNavSettings: {...action.data}
            };
        case SET_DEFAULT_SIDE_NAV:
            return {
                ...state,
                sideNavDefaultSettings: {...action.data}
            };
        default:
            return {...state};
    }
};

export default SideNavReducer;
