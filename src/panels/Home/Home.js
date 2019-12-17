import React, { useState, useCallback, useEffect } from 'react';
import { string, func } from 'prop-types';

import './Home.css';

import connect from '@vkontakte/vk-connect';
import { useSelector, useDispatch } from 'react-redux';
import { getMapState, getUserGeometry, getMapFeatures, getSearchResults } from 'reducers/map-reducer';
import { fetchFeatures, fetchSearch, resetSearchResults, setUserGeometry, updateMapState } from 'actions/map-actions';

import { getSearchState } from 'reducers/search-reducer';
import { setShowSearchResults, setSearchQuery, clearSearchQuery } from 'actions/search-actions';

import { getOrderId } from 'helpers/order';
import { POPUP_LEAVE } from 'constants/popup';

import { debounce } from 'helpers/debounce';

import { Panel, PanelHeader, FixedLayout, HorizontalScroll } from '@vkontakte/vkui';
import Map from 'components/Map';
import Button from 'components/Button';
import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';
import ShopCard from 'components/ShopCard';
import Timetable from 'components/Timetable';
import Link from 'components/Link';
import Search from 'components/Search';
import Title from 'components/Title';

import { ReactComponent as IconSearch } from 'svg/search.svg';
import { ReactComponent as IconBlocks } from 'svg/blocks.svg';

const Home = ({ id, goShop, goOrder }) => {
	const [shop, setShop] = useState(null);
	const mapState = useSelector(getMapState);
	const userGeometry = useSelector(getUserGeometry);
	const features = useSelector(getMapFeatures);

	const searchResults = useSelector(getSearchResults);

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

	/**
	 * Поиск
	 */
	// const [showSearch, setShowSearch] = useState(false);
	// const [q, setQ] = useState('');

	// const toggleSearch = useCallback(() => setShowSearch(state => !state), []);
	// const handleQChange = useCallback(debounce(setQ, 100), []);
	// const handleReset = useCallback(() => {
	// 	toggleSearch();
	// 	setQ('');
		// dispatch(resetSearchResults());
	// }, [toggleSearch, dispatch]);

	const { q, showResults } = useSelector(getSearchState);

	const openSearchResults = useCallback(() => dispatch(setShowSearchResults()), [dispatch]);
	const handleQueryChange = useCallback(
		debounce((q) => dispatch(setSearchQuery(q)), 150),
		[dispatch]);
	const handleReset = useCallback(() => {
		dispatch(clearSearchQuery());
		dispatch(resetSearchResults());
	}, [dispatch]);

	const openResult = useCallback((shop) => goShop(shop, 'description'), [goShop]);

	const renderResult = useCallback((shop, index) =>
		<ShopCard
			key={index}
			className="Home__ShopCard"
			name={shop.properties.group.name}
			activity={shop.properties.group.activity}
			photo={shop.properties.iconContent}
			cashback={shop.properties.group.cashback_value}
			onClick={() => openResult(shop)} />, [openResult]);

	useEffect(() => {
		if (showResults && Boolean(q)) {
			dispatch(fetchSearch(q));
		}
	}, [showResults, q, dispatch]);
	
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
				<HorizontalScroll className="Home__HorizontalScroll">
					<ul className="Home__actions">
						<li className="Home__action">
							<Button
								className="Home__Button"
								theme="black"
								children="Поиск по местам"
								before={<IconSearch />}
								backlight
								onClick={openSearchResults} />
						</li>
						<li className="Home__action">
							<Button
								className="Home__Button"
								theme="black"
								children="Оплатить по QR-коду"
								before={<IconBlocks />}
								backlight
								onClick={openScanner} />
						</li>
					</ul>
				</HorizontalScroll>
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

			<Popup
				visible={showResults}
				autoHeight
				maxDialogHeight="65vh"
				onClose={handleReset}
				header={<Search className="Home__Search" value={q} onChange={handleQueryChange} onReset={handleReset} />}>
				{(searchResults === null) &&
					<Title
						className="Home__Title"
						children="Начинайте вводить"
						hint="description" />}
				{Array.isArray(searchResults) &&
					(searchResults.length > 0)
					? searchResults.map(renderResult)
					: <Title
						className="Home__Title"
						children="Ничего :("
						hint={`По запросу "${q}" ничего не найдено`} />}
			</Popup>
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
	goShop: func.isRequired,
	goOrder: func.isRequired
};

export default Home;
