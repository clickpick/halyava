import * as types from 'constants/types';

const setLayoutMap = () => ({
    type: types.SET_LAYOUT_MAP
});

const setCenterMap = (center) => ({
    type: types.SET_CENTER_MAP,
    center
});

export { setLayoutMap, setCenterMap };