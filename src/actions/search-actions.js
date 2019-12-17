import * as types from 'constants/types';

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

export { setShowSearchResults, setSearchQuery, clearSearchQuery };