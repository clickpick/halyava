import { SEARCH_INITIAL_STATE } from 'constants/store';
import * as types from 'constants/types';

export function searchReducer(state = SEARCH_INITIAL_STATE, action) {
    switch (action.type) {
        case types.SET_SHOW_SEARCH_RESULTS:
            return {
                ...state,
                showResults: true,
            };

        case types.SET_SEARCH_QUERY:
            return {
                ...state,
                q: action.q
            };

        case types.CLEAR_SEARCH_QUERY:
            return {
                ...state,
                q: '',
                showResults: false,
                results: null
            };

        case types.SET_SEARCH_RESULTS:
            return {
                ...state,
                results: action.payload
            };

        default:
            return state;
    }
}

export const getSearchState = (state) => state.search;