// @flow

import {
    FETCH_DATA_ERROR,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
} from '../../constants/action-types';

const initialState = {
    weatherInfo: {},
    isLoading: false,
    error: false,
};


const downloadsReducer = (state: Object = initialState, action: Object) => {
    switch (action.type) {
        case FETCH_DATA_SUCCESS: {
            return {
                isLoading: false,
                error: false,
                path: action.payload.path() ,
            };
        }
        case FETCH_DATA_REQUEST: {
            return {
                isLoading: true,
                error: false,
                weatherInfo: {},
            };
        }
        case FETCH_DATA_ERROR: {
            return {
                ...state,
                isLoading: false,
                error: true,
            };
        }
        default: {
            return state;
        }
    }
};

export default downloadsReducer;
