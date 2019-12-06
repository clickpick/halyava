import React from 'react';
import { string, number, node, oneOfType } from 'prop-types';
import classNames from 'classnames';

import './Row.css';

import { InfoRow } from '@vkontakte/vkui';

const Row = ({ className, ...props }) =>
    <InfoRow className={classNames(className, 'Row')} {...props} />;

Row.propTypes = {
    className: string,
    title: string.isRequired,
    children: oneOfType([string, number, node])
};

export default Row;