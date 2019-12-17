import React, { useCallback } from 'react';
import { string, arrayOf } from 'prop-types';
import classNames from 'classnames';

import './Stack.css';

const Stack = React.memo(({ className, photos }) => {
    if (!photos || photos.length === 0) {
        return null;
    }
    
    const renderPhoto = useCallback((photo, index) =>
        <div
            key={index}
            className="Stack__item"
            style={{ backgroundImage: `url(${photo})` }} />, []);
    
    return <div className={classNames(className, 'Stack')} children={photos.map(renderPhoto)} />;
});

Stack.propTypes = {
    className: string,
    photos: arrayOf(string)
};

export default Stack;