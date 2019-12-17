import { combineReducers } from 'redux';
import { mapReducer } from 'reducers/map-reducer';
import { popupReducer } from 'reducers/popup-reducer';
import { searchReducer } from 'reducers/search-reducer';

const rootReducer = combineReducers({
    map: mapReducer,
    popup: popupReducer,
    search: searchReducer
});

export default rootReducer;