import React, { useCallback } from 'react';
import { string, number, shape, oneOf, arrayOf } from 'prop-types';
import classNames from 'classnames';

import './ShopCard.css';

import { declOfNumber } from 'helpers/numbers';

import { Avatar } from '@vkontakte/vkui';

import Stack from 'components/Stack';
import Tag from 'components/Tag';

import { ReactComponent as IconLike } from 'svg/like.svg';

const MARK_LIKE = 'like';
const MARK_DISLIKE = 'dislike';

const DECLS = ['друг', 'друга', 'друзей'];

const ShopCard = React.memo(({ className, name, activity, photo, cashback, rating, friendRating, ...restProps }) => {
    const tags = [];

    if (cashback) {
        tags.push({
            theme: 'blue',
            children: `${cashback}% кэшбэк`
        });
    }

    if (friendRating) {
        const friends = friendRating.users.slice(-3);
        const isLike = friendRating.mark === MARK_LIKE;

        tags.push({
            theme: (isLike) ? 'green' : 'red',
            children: <>
                <Stack photos={friends.map(friend => friend.avatar_200)} />
                {friendRating.users.length} {declOfNumber(friendRating.users.length, DECLS)} оценили
                <IconLike className={classNames('ShopCard__IconLike', 'ShopCard__IconLike--margin', { 'ShopCard__IconLike--dislike': !isLike })} />
            </>
        });
    } else if (rating) {
        if (rating >= 60) {
            tags.push({
                theme: 'green',
                children: <>
                    <IconLike className="ShopCard__IconLike" />
                    {rating}% людей оценили место
                </>
            });
        }

        if (rating > 40 && rating < 60) {
            tags.push({
                children: <>
                    <IconLike className="ShopCard__IconLike" />
                    <IconLike className="ShopCard__IconLike  ShopCard__IconLike--dislike" />
                    Смешанные отзывы
                </>
            });
        }

        if (rating <= 40) {
            tags.push({
                theme: 'red',
                children: <>
                    <IconLike className="ShopCard__IconLike  ShopCard__IconLike--dislike" />
                    {rating}% людей оценили место
                </>
            });
        }
    }

    const renderTag = useCallback((tag, index) =>
        <Tag key={index} className="ShopCard__Tag" {...tag} />, []);

    return (
        <div className={classNames(className, 'ShopCard')} {...restProps}>
            {(photo) &&
                <Avatar
                    className="ShopCard__Avatar"
                    size={36}
                    src={photo}
                    alt={name} />}
            <div className="ShopCard__info">
                <h2 className="ShopCard__name" children={name} />
                <small className="ShopCard__activity" children={activity} />

                {(tags.length > 0) &&
                    <div className="ShopCard__tags" children={tags.map(renderTag)} />}
            </div>
        </div>
    );
});

ShopCard.propTypes = {
    className: string,
    name: string.isRequired,
    activity: string,
    photo: string,
    cashback: number,
    rating: number,
    friendRating: shape({
        mark: oneOf([MARK_LIKE, MARK_DISLIKE]),
        users: arrayOf(shape({
            avatar_200: string
        }))
    })
};

export default ShopCard;