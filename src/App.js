import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

import { Root } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Main from 'views/Main';

import './App.css';

const App = () => {
	const [activeView] = useState('main');

	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);

	return (
		<Root activeView={activeView}>
			<Main id="main" />
		</Root>
	);
}

export default App;

