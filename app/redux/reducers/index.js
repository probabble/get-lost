import downloadsReducer from './downloads';
import {combineReducers} from "redux";

// Root Reducer
const rootReducer = combineReducers({
    downloads: downloadsReducer,
});

export default rootReducer;