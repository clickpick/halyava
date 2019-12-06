import React from 'react';
import { string, bool, oneOf } from 'prop-types';
import classNames from 'classnames';

import './Loader.css';

import { Spinner } from '@vkontakte/vkui';

import { ReactComponent as IconInvoice } from 'svg/invoice-skeleton.svg';

const Loader = ({ className, view, animation, center, absoluteCenter, ...restProps }) => {
    const props = {
        className: classNames(className, 'Loader', {
            [`Loader--${view}`]: view,
            'Loader--with-animation': animation,
            'Loader--is-center': center,
            'Loader--is-absolute-center': absoluteCenter,
        }),
        ...restProps,
    };

    return (view === 'spinner')
        ? <Spinner {...props} />
        : <IconInvoice {...props} />;
};

Loader.propTypes = {
    className: string,
    view: oneOf(['spinner', 'invoice']),
    animation: bool,
    center: bool,
    absoluteCenter: bool
};

Loader.defaultProps = {
    view: 'spinner'
};

export default Loader;