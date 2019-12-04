import * as types from 'constants/types';
import { POPUP_INITIAL_STATE } from 'constants/store';

export function popupReducer(state = POPUP_INITIAL_STATE, action) {
    switch (action.type) {
        case types.POPUP_ADD:
            return {
                visible: true,
                ...action.entities
            };

        case types.POPUP_CLOSE:
            return {
                ...state,
                visible: false
            };

        default:
            return state;
    }
}

export const getPopup = (state) => state.popup;