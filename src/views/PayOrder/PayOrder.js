import React, { useCallback } from 'react';
import { string, func } from 'prop-types';

import useNavigation from 'hooks/use-navigation';

import { View } from '@vkontakte/vkui';

import Order from 'panels/Order';
import Gratuity from 'panels/Gratuity';

const PayOrder = ({ id, orderId, goMain }) => {
    const [activePanel, history, goForward, goBack] = useNavigation('order');

    const goGratuity = useCallback(() => goForward('gratuity'), [goForward]);

    return (
        <View id={id} activePanel={activePanel} history={history} onSwipeBack={goBack}>
            <Order
                id="order"
                orderId={orderId}
                goGratuity={goGratuity}
                goMain={goMain} />
            <Gratuity
                id="gratuity"
                orderId={orderId}
                goBack={goBack}
                goMain={goMain} />
        </View>
    );
};

PayOrder.propTypes = {
    id: string.isRequired,
    goMain: func.isRequired
};

export default PayOrder;