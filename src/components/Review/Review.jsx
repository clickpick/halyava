import React from 'react';
import { string, shape, number } from 'prop-types';
import classNames from 'classnames';

import './Review.css';

import { Avatar } from '@vkontakte/vkui';

const Review = ({ className, text, user }) => {
    const name = `${user.first_name} ${user.last_name}`;

    return (
        <div className={classNames(className, 'Review')}>
            <Avatar
                className="Review__Avatar"
                src={user.avatar_200}
                alt={name}
                size={36} />
            <div className="Review__content">
                <a
                    className="Review__name"
                    href={`https://vk.com/id${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    children={name} />
                <p className="Review__text" children={text} />
            </div>
        </div>
    );
};

Review.propTypes = {
    className: string,
    text: string.isRequired,
    user: shape({
        id: number.isRequired,
        avatar_200: string,
        first_name: string.isRequired,
        last_name: string.isRequired
    }).isRequired
};

export default Review;