import React, { useState, useCallback } from 'react';
import { string } from 'prop-types';

import useNavigation from 'hooks/use-navigation';

import { ConfigProvider, View } from '@vkontakte/vkui';

import Home from 'panels/Home';
import Shop from 'panels/Shop';

const Main = ({ id }) => {
    const [activePanel, history, goForward, goBack] = useNavigation('home');
    const [shop, setShop] = useState(undefined);

    const goShop = useCallback((shop) => {
        setShop(shop);
        goForward('shop');
    }, [goForward]);

    return (
        <ConfigProvider isWebView={true}>
            <View
                id={id}
                activePanel={activePanel}
                history={history}
                onSwipeBack={goBack}>
                <Home id="home" goShop={goShop} />
                <Shop id="shop" shop={shop} goBack={goBack} />
            </View>
        </ConfigProvider>
    );
};

Main.propTypes = {
    id: string.isRequired
};

export default Main;