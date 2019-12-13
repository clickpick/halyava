import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-connect';
import App from './App';
// import registerServiceWorker from './sw';

import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import { INITIAL_STATE } from 'constants/store';
connect.subscribe(({ detail: { type, data } }) => {
    function setViewSettings(scheme) {
        if (scheme === 'client_dark' || scheme === 'space_gray') {
            connect.send('VKWebAppSetViewSettings', { status_bar_style: 'light', action_bar_color: '#212121' });
        } else {
            connect.send('VKWebAppSetViewSettings', { status_bar_style: 'dark', action_bar_color: '#fff' });
        }
    }

    if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);


        setViewSettings(schemeAttribute.value);
    }
});
// Init VK  Mini App
connect.send('VKWebAppInit');

// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
// registerServiceWorker();

ReactDOM.render(
    <Provider store={configureStore(INITIAL_STATE)}>
        <App />
    </Provider>,
    document.getElementById('root')
);
