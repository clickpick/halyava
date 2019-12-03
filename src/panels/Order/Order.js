import React from 'react';
import { string, func } from 'prop-types';

import { Panel, PanelHeader, HeaderButton } from '@vkontakte/vkui';

const Order = ({ id, orderId, goMain }) => {

    return (
        <Panel id={id}>
            <PanelHeader
                left={<HeaderButton children="Закрыть" onClick={goMain} />}
                children="Оплата заказа"
                noShadow={true} />

            <p>Order ID: {orderId}</p>
        </Panel>
    );
};

Order.propTypes = {
    id: string.isRequired,
    goMain: func.isRequired
};

export default Order;