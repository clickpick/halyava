import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getHasLayout } from 'reducers/map-reducer';
import { setLayoutMap } from 'actions/map-actions';

import { withYMaps } from 'react-yandex-maps';

const MapProvider = React.memo(({ children, ymaps }) => {
    const hasLayout = useSelector(getHasLayout);
    const dispatch = useDispatch();    

    useEffect(() => {
        if (!hasLayout) {
            const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="position: absolute; background-size: cover; box-shadow: 0 0 10px rgba(0,0,0,.3); background-image: url($[properties.iconContent]); width: 24px; height: 24px; top: -12px; left: -12px; border-radius: 100%; overflow: hidden;"></div>'
            );
            ymaps.layout.storage.add('myLayout', MyIconContentLayout);

            dispatch(setLayoutMap());
        }
    }, [ymaps, hasLayout, dispatch]);

    return children;
});

export default withYMaps(MapProvider, true, []);