import React, { useState, useEffect, useCallback } from 'react';

import connect from '@vkontakte/vk-connect';
import { useSelector, useDispatch } from 'react-redux';
import { getPopup } from 'reducers/popup-reducer';
import { showPopup, closePopup } from 'actions/popup-actions';
import { setCenterMap } from 'actions/map-actions';
import * as POPUP from 'constants/popup';

import { getOrderId } from 'helpers/order';

import { ConfigProvider, Root } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Main from 'views/Main';
import PayOrder from 'views/PayOrder';
import Loader from 'views/Loader';

import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';

import './App.css';

import * as VIEWS from 'constants/views';

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.LOADER);
	const [activeOrder, setActiveOrder] = useState(null);

	const popup = useSelector(getPopup);

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

	const goMain = useCallback(() => setActiveView('main'), []);

	const goOrder = useCallback((orderId) => {
		setActiveOrder(orderId);
		setActiveView(VIEWS.PAY_ORDER);
	}, []);

	useEffect(() => {
		window.addEventListener('online', () => {
			if (navigator.onLine) {
				dispatch(closePopup());
			}
		});

		window.addEventListener('offline', () => {
			if (!navigator.onLine) {
				dispatch(showPopup(POPUP.OFFLINE, {}, 0));
			}
		});

		async function getGeodata() {
			try {
				const response = await connect.sendPromise('VKWebAppGetGeodata');

				if (response.available !== 0) {
					dispatch(setCenterMap([response.lat, response.long]));
				}
			} catch (e) {
				if (e.error_data.error_code === 4) {
					dispatch(showPopup(POPUP.GET_GEODATA_DENIED, {}, 7000));
				}
			}
		}

		getGeodata();
	}, [dispatch]);

	useEffect(() => {
		const orderId = getOrderId(window.location.href);

		if (orderId) {
			return goOrder(orderId);
		}
		
		setActiveView(VIEWS.MAIN);
	}, [goOrder]);

	return <>
		<ConfigProvider isWebView={true}>
			<Root activeView={activeView}>
				<Main id={VIEWS.MAIN} goOrder={goOrder} />
				<PayOrder id={VIEWS.PAY_ORDER} orderId={activeOrder} goMain={goMain} />
				<Loader id={VIEWS.LOADER} />
			</Root>
		</ConfigProvider>

		<PopupContainer>
			{(popup) && <Popup {...popup} onClose={() => dispatch(closePopup())} />}
		</PopupContainer>
	</>;
}

export default App;

