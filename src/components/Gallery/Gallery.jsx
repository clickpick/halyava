import React, { useCallback } from 'react';
import { string, arrayOf, shape } from 'prop-types';
import classNames from 'classnames';

import './Gallery.css';

import connect from '@vkontakte/vk-connect';

const Gallery = React.memo(({ className, photos }) => {
    const restPhotosCount = (photos.length > 3) ? photos.length - 3 : 0;
    const firstPhotos = photos.slice(0, 3);

    const showImages = useCallback((start_index = 0) => {
        connect.send('VKWebAppShowImages', {
            images: photos.map((photo) => photo.sizes[photo.sizes.length - 1].url),
            start_index
        })
    }, [photos]);
    
    const renderPhoto = useCallback((photo, index) => {
        return (
            <div
                key={index}
                className={classNames('Gallery__preview', { 'Gallery__preview--last': index === 2 })}
                data-rest-count={restPhotosCount}
                style={{ backgroundImage: `url(${photo.sizes[0].url})` }}
                onClick={() => showImages(index)}>
                <img src={photo.sizes[0].url} alt="фото" />
            </div>
        );
    }, [restPhotosCount, showImages]);

    return <div className={classNames(className, 'Gallery')} children={firstPhotos.map(renderPhoto)} />;
});

Gallery.propTypes = {
    className: string,
    photos: arrayOf(shape({
        sizes: arrayOf(shape({
            url: string
        }))
    })).isRequired
};

export default Gallery;