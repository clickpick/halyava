import React from 'react';
import { string } from 'prop-types';

import useNavigation from 'hooks/use-navigation';

import { ConfigProvider, View } from '@vkontakte/vkui';

import Home from 'panels/Home';

const Main = ({ id }) => {
    const [activePanel, history] = useNavigation('home');

    return (
        <ConfigProvider isWebView={true}>
            <View
                id={id}
                activePanel={activePanel}
                history={history}>
                {/* onSwipeBack={goBack}> */}
                <Home id="home" />
            </View>
        </ConfigProvider>
    );
};

Main.propTypes = {
    id: string.isRequired
};

export default Main;