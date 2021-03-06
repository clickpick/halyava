import React from 'react';
import { string, oneOf, func, bool } from 'prop-types';
import classNames from 'classnames';

import './Button.css';

const Button = ({ className, theme, size, shape, full, backlight, href, onClick, before, children, ...restProps }) => {
    const handleClick = (e) => onClick && onClick(e);

    let props = {
        ...restProps,
        className: classNames(className, 'Button', {
            [`Button--${theme}`]: theme,
            [`Button--${size}`]: size,
            [`Button--${shape}`]: shape,
            'Button--full': full,
            'Button--backlight': backlight,
            'Button--with-before': before,
        }),
        href,
        onClick: handleClick,
    };

    if (href) {
        props = {
            ...props,
            type: null,
            rel: (props.hasOwnProperty('target')) ? 'noreferrer' : undefined,
            onClick: null,
            disabled: null
        };
    }

    const beforeContent = (before) && <span className="Button__before" children={before} />;

    const content = <>
        {beforeContent}
        {children}
    </>;

    return React.createElement(
        (href) ? 'a' : 'button',
        props,
        content
    );
};

Button.propTypes = {
    className: string, // дополнительный класс
    type: oneOf(['button', 'submit', 'reset']),
    theme: oneOf(['primary', 'secondary', 'black']), // тема кнопки
    size: oneOf(['small', 'regular', 'medium']), // размер кнопки
    shape: oneOf(['round', 'circle']), // форма кнопки
    full: bool, // ширина кнопки
    backlight: bool, // подстветка (работает только если theme=primary)
    href: string,
    onClick: func,
    disabled: bool,
};

Button.defaultProps = {
    type: 'button',
    size: 'small',
    shape: 'round'
};

export default Button;