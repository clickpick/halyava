import React, { useCallback } from 'react';
import { string, arrayOf, shape, number, func } from 'prop-types';
import classNames from 'classnames';

import Review from 'components/Review';

const ReviewsList = ({ className, reviews, userId, onRemove }) => {
    const renderReview = useCallback((review, index) =>
        <Review
            key={index}
            className="ReviewsList__Review"
            userId={userId}
            onRemove={onRemove}
            {...review} />,
        [userId, onRemove]);

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
    })),
    userId: number,
    onRemove: func
};

export default ReviewsList;