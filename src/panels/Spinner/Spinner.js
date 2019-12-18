import React from 'react';
import { string } from 'prop-types';

import './Spinner.css';

import { Panel } from '@vkontakte/vkui';
import { ReactComponent as Logo } from 'svg/logo.svg';

const Spinner = ({ id }) => {
    return (
        <Panel id={id} className="Spinner">
            <Logo className="Spinner__Logo" />
        </Panel>
    );
};

Spinner.propTypes = {
    id: string.isRequired
};

export default Spinner;