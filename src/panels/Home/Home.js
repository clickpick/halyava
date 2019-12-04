import React, { useCallback } from 'react';
import { string, func } from 'prop-types';

import './Home.css';

import connect from '@vkontakte/vk-connect';
import { useSelector, useDispatch } from 'react-redux';
import { getMapState, getMapFeatures } from 'reducers/map-reducer';
import { fetchFeatures } from 'actions/map-actions';
import { getOrderId } from 'helpers/order';

import { Panel, PanelHeader, FixedLayout } from '@vkontakte/vkui';
import Map from 'components/Map';
import Button from 'components/Button';

import { ReactComponent as IconBlocks } from 'svg/blocks.svg';

const Home = ({ id, goShop, goOrder }) => {
	const mapState = useSelector(getMapState);
	const features = useSelector(getMapFeatures);

	const dispatch = useDispatch();

	const setFeatures = useCallback(function () {
		dispatch(fetchFeatures(...arguments));
	}, [dispatch]);

	const openScanner = useCallback(async () => {
		try {
			const { code_data } = await connect.sendPromise('VKWebAppOpenCodeReader');
			const orderId = getOrderId(code_data);

			if (orderId) {
				goOrder(orderId);
			}
		} catch (e) {}
	}, []);
	
	return (
		<Panel id={id} className="Home">
			<PanelHeader noShadow={true} />
			<Map
				className="Home__Map"
				mapState={mapState}
				features={features}
				fetchFeatures={setFeatures}
				onClick={goShop} />
			
			<FixedLayout
				className="Home__FixedLayout"
				vertical="bottom">
				<Button
					className="Home__Button"
					theme="primary"
					size="medium"
					children="Оплатить по QR-коду"
					before={<IconBlocks />}
					full
					backlight
					onClick={openScanner} />
			</FixedLayout>
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
	goShop: func.isRequired,
	goOrder: func.isRequired
};

export default Home;
