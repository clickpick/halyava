import React, { useState, useCallback, useEffect } from 'react';
import { string, func } from 'prop-types';

import './Home.css';

import connect from '@vkontakte/vk-connect';
import { useSelector, useDispatch } from 'react-redux';
import { getMapState, getUserGeometry, getMapFeatures, getSearchResults } from 'reducers/map-reducer';
import { fetchFeatures, fetchSearch, resetSearchResults, setUserGeometry, updateMapState } from 'actions/map-actions';

import { getSearchState } from 'reducers/search-reducer';
import { setShowSearchResults, setSearchQuery, clearSearchQuery } from 'actions/search-actions';

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

const Home = ({ id, goShop }) => {
	const [shop, setShop] = useState(null);
	const mapState = useSelector(getMapState);
	const userGeometry = useSelector(getUserGeometry);
	const features = useSelector(getMapFeatures);

	const searchResults = useSelector(getSearchResults);

	const dispatch = useDispatch();

	const setFeatures = useCallback(function () {
		dispatch(fetchFeatures(...arguments));
	}, [dispatch]);

	const openScanner = useCallback(() => connect.send('VKWebAppOpenCodeReader', {}), []);

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
				
				// available number – ios
				// available boolean – android
				if (response.available !== 0 && response.available !== false) {
					dispatch(setUserGeometry([response.lat, response.long]));
				}
			} catch (e) { }
		}

		getGeodata();
	}, [dispatch]);

	/**
	 * Поиск
	 */
	const { q, showResults } = useSelector(getSearchState);

	const [mapMaxHeight, setMapMaxHeight] = useState((showResults) ? 'calc(35vh + 30px)' : undefined);

	const openSearchResults = useCallback(() => {
		setMapMaxHeight('calc(35vh + 30px)');
		dispatch(setShowSearchResults());
	}, [dispatch]);
	const handleQueryChange = useCallback(
		debounce((q) => dispatch(setSearchQuery(q)), 150),
		[dispatch]);
	const handleReset = useCallback(() => {
		dispatch(clearSearchQuery());
		dispatch(resetSearchResults());
		setMapMaxHeight(undefined);
	}, [dispatch]);

	const openResult = useCallback((shop) => goShop(shop, 'description'), [goShop]);

	const renderResult = useCallback((shop, index) =>
		<ShopCard
			key={index}
			className="Home__ShopCard"
			name={shop.properties.group.name}
			activity={shop.properties.group.activity}
			address={shop.properties.address.address}
			photo={shop.properties.iconContent}
			rating={shop.properties.address.rating || undefined}
			friendRating={shop.properties.address.friend_rating || undefined}
			cashback={shop.properties.group.cashback_value}
			onClick={() => openResult(shop)} />, [openResult]);

	const handleSearchResultsPosition = useCallback((height) =>
		(mapMaxHeight !== height) && setMapMaxHeight(`calc(100vh - ${height}px + 30px)`),
		[mapMaxHeight]);

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
				maxHeight={mapMaxHeight}
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
							rating={shop.properties.address.rating || undefined}
							friendRating={shop.properties.address.friend_rating || undefined}
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
				header={<Search className="Home__Search" value={q} onChange={handleQueryChange} onReset={handleReset} />}
				onPositionChange={handleSearchResultsPosition}
				children={
					(searchResults === null)
						? <Title
							className="Home__Title"
							children="Начинайте вводить"
							hint="description" />
						: (Array.isArray(searchResults) && searchResults.length > 0)
							? searchResults.map(renderResult)
							: <Title
								className="Home__Title"
								children="Ничего :("
								hint={`По запросу "${q}" ничего не найдено`} />
				} />
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
	goShop: func.isRequired
};

export default Home;
