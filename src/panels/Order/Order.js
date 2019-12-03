import React, {useState, useEffect} from 'react';
import {func, string} from 'prop-types';
import connect from '@vkontakte/vk-connect';

import {HeaderButton, Panel, PanelHeader, Button} from '@vkontakte/vkui';

import API from 'services/api';

const Order = ({id, orderId, goMain}) => {

    const [order, setOrder] = useState({});

    async function openVkPay() {
        const response = await API.vkPayParams(orderId);

        connect.sendPromise('VKWebAppOpenPayForm', response).then((response) => {

        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        async function fetchData() {
            const response = await API.order(orderId);
            setOrder(response);
        }
        fetchData();
    }, [orderId]);

    return (
        <Panel id={id}>
            <PanelHeader
                left={<HeaderButton children="Закрыть" onClick={goMain}/>}
                children="Оплата заказа"
                noShadow={true}/>

            <p>Order ID: {orderId}</p>
            <Button onClick={() => openVkPay()}>{order.id}</Button>
        </Panel>
    );
};

Order.propTypes = {
    id: string.isRequired,
    goMain: func.isRequired
};

export default Order;
