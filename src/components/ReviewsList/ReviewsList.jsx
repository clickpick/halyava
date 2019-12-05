import React, { useCallback } from 'react';
import { string, arrayOf, shape, number } from 'prop-types';
import classNames from 'classnames';

import Review from 'components/Review';

const ReviewsList = ({ className, reviews }) => {
    const renderReview = useCallback((review, index) =>
        <Review key={index} className="ReviewsList__Review" {...review} />, []);

    return <div className={classNames(className, 'ReviewsList')} children={reviews.map(renderReview)} />;
};

ReviewsList.propTypes = {
    className: string,
    reviews: arrayOf(shape({
        text: string.isRequired,
        user: shape({
            id: number.isRequired,
            avatar_200: string,
            first_name: string.isRequired,
            last_name: string.isRequired
        }).isRequired,
    }))
};

export default ReviewsList;