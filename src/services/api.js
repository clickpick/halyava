import axios from 'axios';
import { parseQueryString } from 'helpers/location';
import { getTimezoneOffset } from 'helpers/dates';

const ENDPOINT = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL: ENDPOINT,
    headers: {
        'Vk-Params': window.btoa(JSON.stringify({
            ...parseQueryString(window.location.search),
            auth_type: 'front',
            utc_offset: getTimezoneOffset()
        })),
        'Accept': 'application/json'
    },
});

const get = (urn) => instance.get(urn);
const post = (urn, body) => instance.post(urn, body);
// const put = (urn, body = {}) => instance.put(urn, body);

class API {
    async auth() {
        return await post('/vk-user/auth');
    }

    async map(topLeftLat, topLeftLng, botRightLat, botRightLng) {
        const response = await get(`/vk-user/map?tllat=${topLeftLat}&tllng=${topLeftLng}&brlat=${botRightLat}&brlng=${botRightLng}`);

        return response.data.data;
    }

    async getReviews(addressId, page = 1) {
        if (!addressId) {
            throw new Error('Bad address id');
        }

        return await get(`/vk-user/addresses/${addressId}/reviews?page[number]=${page}`);
    }

    async createReview(addressId, text) {
        if (!addressId) {
            throw new Error('Bad address id');
        }

        if (!text) {
            throw new Error('text is empty');
        }

        return await post(`/vk-user/addresses/${addressId}/reviews`, { text });
    }

    async getOrder(orderId) {
        if (!orderId) {
            throw new Error('Bad order id');
        }

        return await get(`/vk-user/orders/${orderId}`);
    }

    async getPayParams(orderId) {
        if (!orderId) {
            throw new Error('Bad order id');
        }

        const response = await get(`/vk-user/orders/${orderId}/pay-params`);

        return response.data.data;
    }
}

export default new API();