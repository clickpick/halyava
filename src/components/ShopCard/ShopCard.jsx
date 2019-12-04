import React from 'react';
import { string, number } from 'prop-types';
import classNames from 'classnames';

import './ShopCard.css';

const ShopCard = React.memo(({ className, name, activity, photo, cashback }) => {
    const photoStyle = { backgroundImage: `url(${photo})` };

    return (
        <div className={classNames(className, 'ShopCard')}>
            {(photo) &&
                <div className="ShopCard__photo" style={photoStyle}>
                    <img src={photo} alt={name} />
                </div>}
            <div className="ShopCard__info">
                <h2 className="ShopCard__name" children={name} />
                <small className="ShopCard__activity" children={activity} />
            </div>
            {(cashback) &&
                <p className="ShopCard__cashback">
                    <span className="ShopCard__cashback--value">{cashback}%</span>
                    <br />
                    кэшбэк
                </p>}
        </div>
    );
});

ShopCard.propTypes = {
    className: string,
    name: string.isRequired,
    activity: string,
    photo: string,
    cashback: number
};

export default ShopCard;