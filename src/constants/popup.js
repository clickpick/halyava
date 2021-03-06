export const POPUP_DELAY = 5000;
export const POPUP_LEAVE = 150;

export const OFFLINE = 'offline';
export const SERVER_ERROR = 'server-error';

export const CREATE_REVIEW_SUCCESS = 'create-review-success';
export const CREATE_REVIEW_ERROR = 'create-review-error';

export const ORDER_NOT_FOUND = 'order-not-found';

export const GET_GEODATA_DENIED = 'get-geodata-denied';

export default {
    [OFFLINE]: {
        disabled: true,
        type: 'info',
        title: 'Погоди-погоди',
        message: 'А где доступ в Интернет?',
    },

    [SERVER_ERROR]: {
        type: 'danger',
        title: 'Ой...',
        message: 'У нас какие-то неполадки. Уже чиним...'
    },

    [CREATE_REVIEW_SUCCESS]: {
        type: 'success',
        title: 'Твой отзыв добавлен!'
    },
    [CREATE_REVIEW_ERROR]: {
        type: 'danger',
        title: 'Ой...',
        message: 'Мы не смогли добавить твой отзыв. Уже решаем проблему...'
    },

    [ORDER_NOT_FOUND]: {
        type: 'danger',
        title: 'Хм...',
        message: 'А такого заказа ведь нет'
    },

    [GET_GEODATA_DENIED]: {
        type: 'info',
        title: 'Хорошо-хорошо',
        message: 'К сожалению, ты не разрешил нам получить твою геопозицию, поэтому тебе придётся самому искать себя на карте'
    }
};