import React from 'react';
import { string, func } from 'prop-types';

import { View } from '@vkontakte/vkui';

import Order from 'panels/Order';

const PayOrder = ({ id, orderId, goMain }) =>
    <View id={id} activePanel="order">
        <Order
            id="order"
            orderId={orderId}
            goMain={goMain} />
    </View>;

PayOrder.propTypes = {
    id: string.isRequired,
    goMain: func.isRequired
};

export default PayOrder;