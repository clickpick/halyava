import React, { useState, useCallback, useEffect } from 'react';
import { string, func } from 'prop-types';

import './Home.css';

import connect from '@vkontakte/vk-connect';
import { useSelector, useDispatch } from 'react-redux';
import { getMapState, getUserGeometry, getMapFeatures } from 'reducers/map-reducer';
import { fetchFeatures, setUserGeometry, updateMapState } from 'actions/map-actions';
import { getOrderId } from 'helpers/order';
import { POPUP_LEAVE } from 'constants/popup';

import { Panel, PanelHeader, FixedLayout } from '@vkontakte/vkui';
import Map from 'components/Map';
import Button from 'components/Button';
import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';
import ShopCard from 'components/ShopCard';
import Timetable from 'components/Timetable';
import Link from 'components/Link';

import { ReactComponent as IconBlocks } from 'svg/blocks.svg';

const Home = ({ id, goShop, goOrder }) => {
	const [shop, setShop] = useState(null);
	const mapState = useSelector(getMapState);
	const userGeometry = useSelector(getUserGeometry);
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
	}, [goOrder]);

	const openShop = useCallback((e) => {
		const nextShop = shop;
		const tab = e.currentTarget.dataset.tab;

		setShop(null);		
		setTimeout(() => goShop(nextShop, tab), POPUP_LEAVE);
	}, [shop, goShop]);

	useEffect(() => {
		async function getGeodata() {
			try {
				const response = await connect.sendPromise('VKWebAppGetGeodata');

				if (response.available !== 0) {
					dispatch(setUserGeometry([response.lat, response.long]));
				}
			} catch (e) { }
		}

		getGeodata();
	}, [dispatch]);
	
	return (
		<Panel id={id} className="Home">
			<PanelHeader noShadow={true} />
			<Map
				className="Home__Map"
				mapState={mapState}
				userGeometry={userGeometry}
				features={features}
				fetchFeatures={setFeatures}
				updateMapState={(geo) => dispatch(updateMapState(geo))}
				onClick={setShop} />
			
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

			<PopupContainer>
				<Popup visible={Boolean(shop)} onClose={() => setShop(null)}>
					{(shop) && <>
						<ShopCard
							className="Home__ShopCard"
							name={shop.properties.group.name}
							activity={shop.properties.group.activity}
							photo={shop.properties.iconContent}
							cashback={shop.properties.group.cashback_value} />
						<Timetable
							className="Home__Timetable"
							groupId={shop.properties.group.id}
							addressId={shop.id} />

						<Link
							className="Home__Link"
							icon="info"
							children="Подробнее"
							data-tab="description"
							onClick={openShop} />
						<Link
							className="Home__Link"
							icon="message"
							children="Читать отзывы"
							data-tab="reviews"
							onClick={openShop} />
					</>}
				</Popup>
			</PopupContainer>
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
	goShop: func.isRequired,
	goOrder: func.isRequired
};

export default Home;
