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
                '<div class="Map__Icon" style="background-image: url($[properties.iconContent]);"></div>'
            );
            ymaps.layout.storage.add('myLayout', MyIconContentLayout);

            dispatch(setLayoutMap());
        }
    }, [ymaps, hasLayout, dispatch]);

    return children;
});

export default withYMaps(MapProvider, true, []);