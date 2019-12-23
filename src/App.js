import React, { useState, useEffect, useCallback } from 'react';

import API from 'services/api';
import connect from '@vkontakte/vk-connect';

import { useSelector, useDispatch } from 'react-redux';
import { getPopup } from 'reducers/popup-reducer';
import { showPopup, closePopup } from 'actions/popup-actions';
import * as POPUP from 'constants/popup';

import { getHashParam } from 'helpers/location';

import { ConfigProvider, Root } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Main from 'views/Main';
import PayOrder from 'views/PayOrder';
import Address from 'views/Address';
import Loader from 'views/Loader';

import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';

import './App.css';

import * as VIEWS from 'constants/views';

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.LOADER);
	const [activeOrder, setActiveOrder] = useState(null);
	const [shop, setShop] = useState(null);

	const popup = useSelector(getPopup);

	const dispatch = useDispatch();

	const goMain = useCallback(() => setActiveView('main'), []);

	const goOrder = useCallback((orderId) => {
		setActiveOrder(orderId);
		setActiveView(VIEWS.PAY_ORDER);
	}, []);

	const goAddress = useCallback((addressId) => {
		async function getShop() {
			try {
				const shop = await API.getAddress(addressId);
				setShop(shop);
				setActiveView(VIEWS.ADDRESS);
			} catch (e) { }
		}

		getShop();
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
	}, [dispatch]);

	useEffect(() => {
		window.addEventListener('hashchange', () => {
			const orderId = getHashParam(window.location.href, 'order');
			const addressId = getHashParam(window.location.href, 'address');

			connect.sendPromise('VKWebAppSetLocation', { location: '#' });

			if (orderId) {
				return goOrder(orderId);
			}

			if (addressId) {
				return goAddress(addressId);
			}
		});

		connect.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppOpenCodeReaderResult') {
				const orderId = getHashParam(data.code_data, 'order');

				if (orderId) {
					goOrder(orderId);
				}
			}
		});

		const orderId = getHashParam(window.location.href, 'order');
		const addressId = getHashParam(window.location.href, 'address');

		connect.send('VKWebAppSetLocation', { location: '#' });

		if (orderId) {
			return goOrder(orderId);
		}	

		if (addressId) {
			return goAddress(addressId);
		}

		setActiveView(VIEWS.MAIN);
	}, [goOrder, goAddress, dispatch]);

	return <>
		<ConfigProvider isWebView={true}>
			<Root activeView={activeView}>
				<Main id={VIEWS.MAIN} />
				<PayOrder id={VIEWS.PAY_ORDER} orderId={activeOrder} goMain={goMain} />
				<Address id={VIEWS.ADDRESS} shop={shop} goMain={goMain} />
				<Loader id={VIEWS.LOADER} />
			</Root>
		</ConfigProvider>

		<PopupContainer>
			{(popup) && <Popup {...popup} onClose={() => dispatch(closePopup())} />}
		</PopupContainer>
	</>;
}

export default App;

