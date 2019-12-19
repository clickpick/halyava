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
        
        case types.SET_USER_GEOMETRY: {
            if (!state.userGeometry) {
                return {
                    ...state,
                    userGeometry: action.geometry,
                    state: {
                        ...state.state,
                        center: action.geometry
                    }
                };
            }

            return {
                ...state,
                userGeometry: action.geometry
            };
        }

        case types.SET_FEATURES:
            return {
                ...state,
                features: action.features
            };

        case types.UPDATE_MAP_STATE:
            return {
                ...state,
                state: {
                    ...state.state,
                    ...action.mapState
                }
            };

        default:
            return state;
    }
}

export const getMapState = (state) => state.map.state;
export const getUserGeometry = (state) => state.map.userGeometry;
export const getHasLayout = (state) => state.map.hasLayout;
export const getMapFeatures = (state) => state.map.features;