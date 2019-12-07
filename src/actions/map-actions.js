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
})

const fetchFeatures = (topLeftLat, topLeftLng, botRightLat, botRightLng) => async (dispatch) => {
    try {
        const { features } = await API.map(topLeftLat, topLeftLng, botRightLat, botRightLng);
        dispatch(setFeatures(features));
    } catch (err) {}
};

export { setLayoutMap, setCenterMap, setUserGeometry, updateMapState, fetchFeatures };