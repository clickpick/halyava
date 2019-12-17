export const MAP_INITIAL_STATE = {
    hasLayout: false,
    state: {
        center: [53.210467, 50.183139],
        zoom: 14,
        behaviors: ['default', 'scrollZoom'],
        controls: []
    },
    features: [],
    userGeometry: null,
    searchResults: null,
};

export const POPUP_INITIAL_STATE = null;

export const SEARCH_INITIAL_STATE = {
    q: '',
    showResults: false,
};

export const INITIAL_STATE = {
    map: MAP_INITIAL_STATE,
    popup: POPUP_INITIAL_STATE
};