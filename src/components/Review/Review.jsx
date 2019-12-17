import React from 'react';
import { string, shape, number, oneOf, func } from 'prop-types';
import classNames from 'classnames';

import './Review.css';

import { Avatar } from '@vkontakte/vkui';
import Tag from 'components/Tag';

import { ReactComponent as IconLike } from 'svg/like.svg';

const MARK_LIKE = 'like';
const MARK_DISLIKE = 'dislike';

const Review = React.memo(({ className, id, text, mark, user, userId, onRemove }) => {
    const isCurrentUserReview = user.id === userId;
    const name = `${user.first_name} ${user.last_name} `;

    let tagText = 'Нравится';
    let tagTheme = 'green';
    let iconLikeClassName = 'Review__IconLike';
    if (mark === MARK_DISLIKE) {
        tagText = 'Не нравится';
        tagTheme = 'red';
        iconLikeClassName += '  Review__IconLike--dislike';
    }

    function handleRemoveClick() {        
        if (onRemove) {
            onRemove(id);
        }
    }

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
                    rel="noopener noreferrer">
                    {name}
                    {(isCurrentUserReview) && <span className="Review__user-mark" children="(вы)" />}
                </a>
                <p className="Review__text" children={text} />

                <footer className="Review__footer">
                    <Tag className="Review__Tag" theme={tagTheme}>
                        <IconLike className={iconLikeClassName} />{tagText}
                    </Tag>
                    {(isCurrentUserReview) &&
                        <button
                            className="Review__remove-review"
                            children="Удалить отзыв"
                            onClick={handleRemoveClick} />}
                </footer>
            </div>
        </div>
    );
});

Review.propTypes = {
    className: string,
    id: number.isRequired,
    text: string.isRequired,
    mark: oneOf([MARK_LIKE, MARK_DISLIKE]).isRequired,
    user: shape({
        id: number.isRequired,
        avatar_200: string,
        first_name: string.isRequired,
        last_name: string.isRequired
    }).isRequired,
    userId: number,
    onRemove: func
};

export default Review;