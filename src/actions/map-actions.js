import * as types from 'constants/types';
import API from 'services/api';

const setLayoutMap = () => ({
    type: types.SET_LAYOUT_MAP
});

const setCenterMap = (center) => ({
    type: types.SET_CENTER_MAP,
    center
});

const setFeatures = (features) => ({
    type: types.SET_FEATURES,
    features
});

const fetchFeatures = (topLeftLat, topLeftLng, botRightLat, botRightLng) => async (dispatch) => {
    try {
        const { features } = await API.map(topLeftLat, topLeftLng, botRightLat, botRightLng);
        dispatch(setFeatures(features));
    } catch (err) {}
};

export { setLayoutMap, setCenterMap, fetchFeatures };