import React, { useState, useCallback } from 'react';
import { string, func } from 'prop-types';

import './Gratuity.css';

import API from 'services/api';
import connect from '@vkontakte/vk-connect';
import { callTaptic, TAPTIC_SUCCESS, TAPTIC_ERROR } from 'helpers/taptic';

import { CREATED, PAID, ERROR_PAY } from 'constants/order';

import { Panel, PanelHeader, PanelHeaderBack, FixedLayout } from '@vkontakte/vkui';
import Wrapper from 'components/Wrapper';
import Title from 'components/Title';
import Success from 'components/Success';
import Error from 'components/Error';
import Input from 'components/Input';
import Button from 'components/Button';

const Gratuity = ({ id, orderId, goBack, goMain }) => {
    const [status, setStatus] = useState(CREATED);
    const [cash, setCash] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleCashChange = useCallback((e) => setCash(String(e.currentTarget.value.replace(/\s/g, ''))), []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisabled(true);

        try {
            const params = await API.getTipPayParams(orderId, Number(cash));

            const payResponse = await connect.sendPromise('VKWebAppOpenPayForm', params);

            let status = payResponse.status;
            if (payResponse.hasOwnProperty('result')) {
                status = payResponse.result.status;
            }

            setDisabled(false);
            
            if (status) {
                setStatus(PAID);
                callTaptic(TAPTIC_SUCCESS);
            } else {
                setStatus(ERROR_PAY);
                callTaptic(TAPTIC_ERROR);
            }
        } catch (err) {
            console.log(err);
            
            setDisabled(false);
        }
    };

    return (
        <Panel id={id} className="Gratuity">
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />} noShadow={true} />

            <Wrapper className="Gratuity__Wrapper">
                {(status === CREATED) &&
                    <form className="Gratuity__form" onSubmit={handleSubmit}>
                        <Input
                            className="Gratuity__Input"
                            name="cash"
                            top="Оставить чаевые"
                            placeholder="300"
                            value={cash}
                            postfix=" ₽"
                            onChange={handleCashChange} />
                        <Button
                            className="Gratuity__Button"
                            type="submit"
                            theme="primary"
                            size="medium"
                            children="Отправить напрямую"
                            disabled={!Boolean(cash) || disabled}
                            full
                            backlight />
                    </form>}

                {(status === PAID) && <>
                    <Title className="Gratuity__Title" type="success" children="Спасибо!" />
                    <Success className="Gratuity__Success" />

                    <FixedLayout className="Gratuity__FixedLayout" vertical="bottom">
                        <Button
                            className="Gratuity__Button"
                            theme="primary"
                            size="medium"
                            children="Открыть карту"
                            onClick={goMain}
                            full
                            backlight />
                    </FixedLayout>
                </>}

                {(status === ERROR_PAY) && <>
                    <Title className="Gratuity__Title" type="error" children="Ошибка" />
                    <Error className="Gratuity__Error" />

                    <FixedLayout className="Gratuity__FixedLayout" vertical="bottom">
                        <div className="Gratuity__actions">
                            <Button
                                className="Gratuity__Button  Gratuity__Button--mb"
                                theme="secondary"
                                size="medium"
                                children="Открыть карту"
                                onClick={goMain}
                                full />
                            <Button
                                className="Gratuity__Button"
                                theme="primary"
                                size="medium"
                                children="Перевести снова"
                                disabled={disabled}
                                onClick={handleSubmit}
                                full
                                backlight />
                        </div>
                    </FixedLayout>
                </>}

            </Wrapper>
        </Panel>
    );
};

Gratuity.propTypes = {
    id: string.isRequired,
    orderId: string.isRequired,
    goBack: func.isRequired
};

export default Gratuity;