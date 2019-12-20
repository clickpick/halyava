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
const del = (urn) => instance.delete(urn);

class API {
    async auth() {
        return await post('/vk-user/auth');
    }

    async map(topLeftLat, topLeftLng, botRightLat, botRightLng) {
        const response = await get(`/vk-user/map?tllat=${topLeftLat}&tllng=${topLeftLng}&brlat=${botRightLat}&brlng=${botRightLng}`);

        return response.data.data;
    }

    async getAddress(addressId) {
        if (!addressId) {
            throw new Error('Bad address id');
        }

        const { data: { data } } = await get(`/vk-user/addresses/${addressId}`);

        return data;
    }

    async search(lat, lng, q) {
        let query = '?';

        if (lat && lng) {
            query += `lat=${lat}&lng=${lng}&`;
        }

        if (q) {
            query += `q=${q}`;
        }

        const response = await get(`/vk-user/search${query}`);

        return response.data.data;
    }

    async getReviews(addressId, page = 1, restQueryParams = '') {
        if (!addressId) {
            throw new Error('Bad address id');
        }

        let query = `page[number]=${page}`;

        if (restQueryParams) {
            query += `&${restQueryParams}`;
        }

        return await get(`/vk-user/addresses/${addressId}/reviews?${query}`);
    }

    async getFriendReviews(addressId) {
        const { data: { data } } = await this.getReviews(addressId, 1, 'user_id=1');

        return data;
    }

    async createReview(addressId, body) {
        if (!addressId) {
            throw new Error('Bad address id');
        }

        if (!body || !body.hasOwnProperty('text') || !body.hasOwnProperty('mark')) {
            throw new Error('Bad body');
        }

        const response = await post(`/vk-user/addresses/${addressId}/reviews`, body);

        return response.data.data;
    }

    async deleteReview(reviewId) {
        if (!reviewId) {
            throw new Error('Bad reivew id');
        }

        return await del(`/vk-user/reviews/${reviewId}`);
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

    async callAPI(method, params) {
        if (!method) {
            throw new Error('Bad method');
        }

        const response =  await post('/vk-user/call-api', { method, params });
        return response.data;
    }
}

export default new API();