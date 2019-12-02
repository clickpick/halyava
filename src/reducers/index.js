import { combineReducers } from 'redux';
import { mapReducer } from 'reducers/map-reducer';

const rootReducer = combineReducers({
    map: mapReducer
});

export default rootReducer;