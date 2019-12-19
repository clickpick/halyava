import * as types from 'constants/types';
import API from 'services/api';

const setShowSearchResults = () => ({
    type: types.SET_SHOW_SEARCH_RESULTS
})

const setSearchQuery = (q) => ({
    type: types.SET_SEARCH_QUERY,
    q
});

const clearSearchQuery = () => ({
    type: types.CLEAR_SEARCH_QUERY
});

const setSearchResults = (payload) => ({
    type: types.SET_SEARCH_RESULTS,
    payload
});

const fetchSearch = (q) => async (dispatch, getState) => {
    const userGeometry = getState().map.userGeometry || ['', ''];
    const [lat, lng] = userGeometry;

    try {
        const result = await API.search(lat, lng, q);

        dispatch(setSearchResults(result.features));
    } catch (e) {
        console.log(e.response);
    }
}

export { fetchSearch, setShowSearchResults, setSearchQuery, clearSearchQuery };