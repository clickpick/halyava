import { getHash } from 'helpers/location';

export const getOrderId = (link) => {
    let orderId = null;
    const params = getHash(link).split('&');

    for (let i = 0; i < params.length; i++) {
        const [key, value] = params[i].split('=');

        if (key === 'order') {
            orderId = value;
            break;
        }
    }

    return orderId;
};