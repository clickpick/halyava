export const MAP_INITIAL_STATE = {
    hasLayout: false,
    state: {
        center: [55.751574, 37.573856],
        zoom: 14,
        behaviors: ['default', 'scrollZoom'],
        controls: []
    },
    features: []
};

export const POPUP_INITIAL_STATE = null;

export const INITIAL_STATE = {
    map: MAP_INITIAL_STATE,
    popup: POPUP_INITIAL_STATE
};