import React, { useState, useEffect, useCallback } from 'react';
import connect from '@vkontakte/vk-connect';

import { useDispatch } from 'react-redux';
import { setCenterMap } from 'actions/map-actions';

import { getHash } from 'helpers/location';

import { Root } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Main from 'views/Main';
import PayOrder from 'views/PayOrder';
import Loader from 'views/Loader';

import './App.css';

import * as VIEWS from 'constants/views';

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.LOADER);
	const [activeOrder, setActiveOrder] = useState(null);

	const dispatch = useDispatch();

	// useEffect(() => {
	// 	connect.subscribe(({ detail: { type, data }}) => {
	// 		if (type === 'VKWebAppUpdateConfig') {
	// 			const schemeAttribute = document.createAttribute('scheme');
	// 			schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
	// 			document.body.attributes.setNamedItem(schemeAttribute);
	// 		}
	// 	});
	// }, []);

	const getOrderId = useCallback((link) => {
		let orderId = null;
		const params = getHash(window.location.href).split('&');

		for (let i = 0; i < params.length; i++) {
			const [key, value] = params[i].split('=');

			if (key === 'order') {
				orderId = value;
				break;
			}
		}

		return orderId;
	}, []);

	const goMain = useCallback(() => setActiveView('main'), []);

	useEffect(() => {
		const orderId = getOrderId(window.location.href);

		if (orderId) {
			setActiveOrder(orderId);
			setActiveView(VIEWS.PAY_ORDER);
			return;
		}
		
		setActiveView(VIEWS.MAIN);
	}, [getOrderId]);

	useEffect(() => {
		if (activeView === VIEWS.MAIN) {
			async function getGeodata() {
				try {
					const response = await connect.sendPromise('VKWebAppGetGeodata');

					if (response.available !== 0) {
						dispatch(setCenterMap([response.lat, response.long]));
					}
				} catch (e) { }
			}

			getGeodata();
		}
	}, [activeView, dispatch]);

	return (
		<Root activeView={activeView}>
			<Main id={VIEWS.MAIN} />
			<PayOrder id={VIEWS.PAY_ORDER} orderId={activeOrder} goMain={goMain} />
			<Loader id={VIEWS.LOADER} />
		</Root>
	);
}

export default App;

