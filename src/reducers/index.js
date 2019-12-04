import { combineReducers } from 'redux';
import { mapReducer } from 'reducers/map-reducer';
import { popupReducer } from 'reducers/popup-reducer';

const rootReducer = combineReducers({
    map: mapReducer,
    popup: popupReducer
});

export default rootReducer;