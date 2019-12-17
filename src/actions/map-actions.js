import * as types from 'constants/types';
import API from 'services/api';

const setLayoutMap = () => ({
    type: types.SET_LAYOUT_MAP
});

const setCenterMap = (center) => ({
    type: types.SET_CENTER_MAP,
    center
});

const setUserGeometry = (geometry) => ({
    type: types.SET_USER_GEOMETRY,
    geometry
});

const setFeatures = (features) => ({
    type: types.SET_FEATURES,
    features
});

const updateMapState = (mapState) => ({
    type: types.UPDATE_MAP_STATE,
    mapState
});

const setSearchResults = (payload) => ({
    type: types.SET_SEARCH_RESULTS,
    payload
});

const resetSearchResults = () => ({
    type: types.RESET_SEARCH_RESULTS
});

const fetchFeatures = (topLeftLat, topLeftLng, botRightLat, botRightLng) => async (dispatch) => {
    try {
        const { features } = await API.map(topLeftLat, topLeftLng, botRightLat, botRightLng);
        dispatch(setFeatures(features));
    } catch (err) {}
};

const fetchSearch = (q) => async (dispatch) => {
    try {
        const result = await API.search('', '', q);
        
        dispatch(setSearchResults(result.features));
    } catch (e) {
        console.log(e.response);
    }
}

export {
    setLayoutMap, setCenterMap, setUserGeometry, updateMapState,
    fetchFeatures, fetchSearch, resetSearchResults
};