import * as types from 'constants/types';
import POPUPS, { POPUP_DELAY } from 'constants/popup';
import connect from '@vkontakte/vk-connect';

const popupTypes = {
    info: 'warning',
    success: 'success',
    danger: 'error',
};

const addPopup = (entities) => ({
    type: types.POPUP_ADD,
    entities
});

const closePopup = () => ({
    type: types.POPUP_CLOSE
});

const showPopup = (popupId, props = {}, timeout = POPUP_DELAY) => (dispatch, getState) => {
    const { popup } = getState();
    const hasActivePopup = popup && popup.visible;
    let delay = 0;

    if (hasActivePopup) {
        delay = 500;
        dispatch(closePopup());
    }

    setTimeout(() => {
        const popupProps = {
            ...POPUPS[popupId],
            ...props
        };

        dispatch(addPopup(popupProps));

        if (connect.supports('VKWebAppTapticNotificationOccurred')) {
            connect.send('VKWebAppTapticNotificationOccurred', { type: popupTypes[popupProps.type || 'info'] });
        }

        if (timeout) {
            setTimeout(() => dispatch(closePopup()), timeout);
        }
    }, delay);
};

export { showPopup, closePopup };

