import React, { useState, useCallback, useEffect } from 'react';
import { string, func } from 'prop-types';

import './Order.css';

import API from 'services/api';
import connect from '@vkontakte/vk-connect';

import { useDispatch } from 'react-redux';
import { showPopup } from 'actions/popup-actions';
import * as POPUP from 'constants/popup';

import { Panel, PanelHeader, HeaderButton, FixedLayout } from '@vkontakte/vkui';
import Loader from 'components/Loader';
import Wrapper from 'components/Wrapper';
import ShopCard from 'components/ShopCard';
import Button from 'components/Button';
import Success from 'components/Success';
import Error from 'components/Error';
import Row from 'components/Row';
import Link from 'components/Link';

import { ReactComponent as IconVk } from 'svg/vk.svg';

import { CREATED, PAID, ERROR_PAY } from 'constants/order';
import { gaps } from 'helpers/numbers';

const Order = ({ id, orderId, goMain }) => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState(CREATED);
    const [disabled, setDisabled] = useState(false);

    const dispatch = useDispatch();

    const pay = useCallback(async () => {
        setDisabled(true);

        try {
            const params = await API.getPayParams(orderId);
            
            const payResponse = await connect.sendPromise('VKWebAppOpenPayForm', params);

            let status = payResponse.status;
            if (payResponse.hasOwnProperty('result')) {
                status = payResponse.result.status;
            }

            setDisabled(false);
            if (status) {
                setStatus(PAID);
            } else {
                setStatus(ERROR_PAY);
            }
        } catch (err) {
            setDisabled(false);
        }
    }, [orderId]);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);

            try {
                const { data: { data } } = await API.getOrder(orderId);
                
                setOrder(data);
                setStatus(data.status);
                setLoading(false);
            } catch (e) {
                setTimeout(goMain, 1000);

                if (e.response.status === 404) {
                    return dispatch(showPopup(POPUP.ORDER_NOT_FOUND));
                }

                dispatch(showPopup(POPUP.ORDER_SERVER_ERROR));
            }
        }

        fetchOrder();
    }, [orderId, goMain, dispatch]);

    return (
        <Panel id={id} className="Order">
            <PanelHeader
                left={<HeaderButton children="Закрыть" onClick={goMain} />}
                children="Оплата заказа"
                noShadow={true} />

            {(loading)
                ? <Loader absoluteCenter />
                : (order) && <Wrapper className="Order__Wrapper">
                    {(status === CREATED) && <>
                        <h1 className="Order__title" children="Счёт на оплату" />

                        {(order.group) &&
                            <ShopCard
                                className="Order__ShopCard"
                                name={order.group.name}
                                activity={order.group.activity}
                                photo={order.group.photo_200} />}

                        <Loader className="Order__invoice" view="invoice" center />

                        <strong className="Order__value">
                            <span>Итого</span>
                            <span>{gaps(order.value)} ₽</span>
                        </strong>

                        <FixedLayout
                            className="Order__FixedLayout"
                            vertical="bottom">
                            <Button
                                className="Shop__Button"
                                theme="primary"
                                size="medium"
                                children="Оплатить через VK Pay"
                                before={<IconVk />}
                                disabled={disabled}
                                onClick={pay}
                                full
                                backlight />
                        </FixedLayout>
                    </>}

                    {(status === PAID) && <>
                        <h1 className="Order__title  Order__title--success" children="Оплачено" />
                        <Success className="Order__Success" />

                        {(order.group) &&
                            <ShopCard
                                className="Order__ShopCard"
                                name={order.group.name}
                                activity={order.group.activity}
                                photo={order.group.photo_200} />}

                        <Row
                            className="Order__Row"
                            title="Сумма"
                            children={`${gaps(order.value)} ₽`} />
                        <Link
                            className="Order__Link"
                            icon="info"
                            children="Открыть заведение"
                            data-tab="description" />
                        <Link
                            className="Order__Link"
                            icon="message"
                            children="Написать отзыв"
                            data-tab="reviews" />
                    </>}

                    {(status === ERROR_PAY) && <>
                        <h1 className="Order__title  Order__title--error" children="Ошибка" />
                        <Error className="Order__Error" />

                        {(order.group) &&
                            <ShopCard
                                className="Order__ShopCard"
                                name={order.group.name}
                                activity={order.group.activity}
                                photo={order.group.photo_200} />}

                        <Row
                            className="Order__Row"
                            title="Сумма"
                            children={`${gaps(order.value)} ₽`} />


                        <FixedLayout
                            className="Order__FixedLayout"
                            vertical="bottom">
                            <Button
                                className="Shop__Button"
                                theme="primary"
                                size="medium"
                                children="Оплатить снова"
                                disabled={disabled}
                                onClick={pay}
                                full
                                backlight />
                        </FixedLayout>
                    </>}
                </Wrapper>}
            
        </Panel>
    );
};

Order.propTypes = {
    id: string.isRequired,
    orderId: string,
    goMain: func.isRequired
};

export default Order;