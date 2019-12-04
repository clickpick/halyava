import React from 'react';
import { string, oneOf, func } from 'prop-types';
import classNames from 'classnames';

import './Link.css';

import { ReactComponent as IconInfo } from 'svg/info.svg';
import { ReactComponent as IconMessage } from 'svg/message.svg';
import { ReactComponent as IconArrow } from 'svg/arrow.svg';

function getIcon(icon) {
    switch (icon) {
        case 'info':
            return <IconInfo className="Link__icon" />;
        case 'message':
            return <IconMessage className="Link__icon" />;
        default:
            return null;
    }
}

const Link = React.memo(({ className, children, icon, onClick }) => {

    return (
        <button
            className={classNames(className, 'Link')}
            onClick={onClick}>
            {(icon) && getIcon(icon)}
            <span className="Link__name" children={children} />
            <IconArrow className="Link__IconArrow" />
        </button>
    );
});

Link.propTypes = {
    className: string,
    children: string.isRequired,
    icon: oneOf(['info', 'message']),
    onClick: func
};

export default Link;