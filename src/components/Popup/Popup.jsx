import React, { useState, useEffect, useMemo } from 'react';
import { string, bool, func, oneOf, arrayOf, shape, oneOfType, node } from 'prop-types';
import classNames from 'classnames';

import './Popup.css';

import Dialog from './Dialog';

const Popup = ({
    className,
    visible, disabled, onClose, autoHeight, maxDialogHeight,
    header, type, title, message, children, actions,
    onPositionChange
}) => {
    const [show, setShow] = useState(false);
    const [animationType, setAnimationType] = useState('leave');

    useEffect(() => {
        if (visible && !show) {
            setShow(true);
            setAnimationType('enter');
        } else if (show && !visible) {
            setAnimationType('leave');
        }
    }, [visible, show]);

    const style = useMemo(() => ({
        display: (show) ? '' : 'none',
        height: (autoHeight) ? 'auto' : '100vh'
    }), [show, autoHeight]);

    function animationEnd() {
        if (animationType === 'leave') {
            setShow(false);
        }
    }

    function close() {
        if (!disabled && onClose) {
            onClose();
        }
    }

    return (
        <div
            style={style}
            className={classNames(className, 'Popup', `Popup--fade-${animationType}`)}
            tabIndex={-1}
            onClick={close}
            onAnimationEnd={animationEnd}>
            <div className="Popup__mask" />
            {(show) && 
                <Dialog
                    className="Popup__Dialog"
                    disabled={disabled}
                    onClose={close}
                    animationType={animationType}
                    maxDialogHeight={maxDialogHeight}
                    header={header}
                    type={type}
                    title={title}
                    message={message}
                    children={children}
                    actions={actions}
                    onPositionChange={onPositionChange} />}
        </div>
    );
};

Popup.propTypes = {
    className: string,
    visible: bool,
    disabled: bool,
    autoHeight: bool,
    maxDialogHeight: string,
    header: oneOfType([node, arrayOf(node)]),
    type: oneOf(['info', 'success', 'danger']),
    title: string,
    message: string,
    onClose: func,
    actions: arrayOf(shape({
        theme: oneOf(['primary', 'secondary', 'info', 'link']),
        title: string,
        action: func,
        full: bool
    })),
    onPositionChange: func
};

export default Popup;