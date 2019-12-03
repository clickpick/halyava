import { MAP_INITIAL_STATE } from 'constants/store';
import * as types from 'constants/types';

export function mapReducer(state = MAP_INITIAL_STATE, action) {
    switch (action.type) {
        case types.SET_LAYOUT_MAP:
            return {
                ...state,
                hasLayout: true
            };

        case types.SET_CENTER_MAP:            
            return {
                ...state,
                state: {
                    ...state.state,
                    center: action.center
                }
            };

        case types.SET_FEATURES:
            return {
                ...state,
                features: action.features
            };

        default:
            return state;
    }
}

export const getMapState = (state) => state.map.state;
export const getHasLayout = (state) => state.map.hasLayout;
export const getMapFeatures = (state) => state.map.features;