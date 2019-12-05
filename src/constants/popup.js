export const POPUP_DELAY = 5000;
export const POPUP_LEAVE = 150;

export const OFFLINE = 'offline';
export const TOKEN_DENIED = 'token-denied';

export const CREATE_REVIEW_SUCCESS = 'create-review-success';
export const CREATE_REVIEW_ERROR = 'create-review-error';

export default {
    [OFFLINE]: {
        disabled: true,
        type: 'info',
        title: 'Погоди-погоди',
        message: 'А где доступ в Интернет?',
    },

    [TOKEN_DENIED]: {
        type: 'info',
        title: 'Ой...',
        message: 'Ты не дал доступ для получения общей информации, поэтому мы не сможем показать тебе всю информацию о заведении.'
    },

    [CREATE_REVIEW_SUCCESS]: {
        type: 'success',
        title: 'Твой отзыв добавлен!'
    },
    [CREATE_REVIEW_ERROR]: {
        type: 'danger',
        title: 'Ой...',
        message: 'Мы не смогли добавить твой отзыв. Уже решаем проблему...'
    }
};