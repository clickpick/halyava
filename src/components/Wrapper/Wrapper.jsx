import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import './Wrapper.css';

const Wrapper = ({ className, children }) =>
    <div className={classNames(className, 'Wrapper')} children={children} />;

Wrapper.propTypes = {
    className: string
};

export default Wrapper;