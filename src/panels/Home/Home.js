import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { string, func } from 'prop-types';

import './Home.css';

import connect from '@vkontakte/vk-connect';
import { useSelector, useDispatch } from 'react-redux';
import { getMapState, getUserGeometry, getMapFeatures } from 'reducers/map-reducer';
import { fetchFeatures, setUserGeometry, updateMapState } from 'actions/map-actions';

import { getSearchState } from 'reducers/search-reducer';
import { fetchSearch, setShowSearchResults, setSearchQuery, clearSearchQuery } from 'actions/search-actions';

import { POPUP_LEAVE } from 'constants/popup';

import { debounce } from 'helpers/debounce';
import { scroll } from 'helpers/scroll';

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

import { ReactComponent as IconLocation } from 'svg/location.svg';
import { ReactComponent as IconSearch } from 'svg/search.svg';
import { ReactComponent as IconBlocks } from 'svg/blocks.svg';

const Home = ({ id, goShop }) => {
	const [shop, setShop] = useState(null);
	const mapState = useSelector(getMapState);
	const userGeometry = useSelector(getUserGeometry);
	const mapFeatures = useSelector(getMapFeatures);

	const dispatch = useDispatch();

	const getGeodata = useCallback(async (callback = () => { }) => {
		try {
			const response = await connect.sendPromise('VKWebAppGetGeodata');

			// available number – ios
			// available boolean – android
			if (response.available !== 0 && response.available !== false) {
				const geodata = [response.lat, response.long];
				callback(geodata);

				return geodata;
			}
		} catch (e) { }

		return null;
	}, []);

	const whereIAm = useCallback((geodata) => {
		dispatch(setUserGeometry(geodata));
		dispatch(updateMapState({
			center: geodata,
			zoom: 16
		}));
	}, [dispatch]);

	const myLocation = useCallback(() => getGeodata(whereIAm), [getGeodata, whereIAm]);

	const setFeatures = useCallback(function () {
		dispatch(fetchFeatures(...arguments));
	}, [dispatch]);

	const openScanner = useCallback(() => connect.send('VKWebAppOpenCodeReader', {}), []);

	const openShop = useCallback((e) => {
		const nextShop = shop;
		const tab = e.currentTarget.dataset.tab;

		setShop(null);
		setTimeout(() => goShop(nextShop, tab), POPUP_LEAVE + 50);
	}, [shop, goShop]);

	useEffect(() => {
		getGeodata((geodata) => dispatch(setUserGeometry(geodata)));
	}, [getGeodata, dispatch]);

	/**
	 * Поиск
	 */
	const { q, showResults, results } = useSelector(getSearchState);

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
		if (showResults) {
			if (Boolean(q)) {
				dispatch(fetchSearch(q));
			}

			scroll();
		}
	}, [showResults, q, dispatch]);

	const features = useMemo(() => (showResults && Array.isArray(results)) ? results : mapFeatures, [showResults, results, mapFeatures]);
	
	return (
		<Panel id={id} className="Home">
			<PanelHeader noShadow={true} />
			<Map
				className="Home__Map"
				maxHeight={mapMaxHeight}
				mapState={mapState}
				userGeometry={userGeometry}
				features={features}
				bounding={showResults && features.length > 0 && Boolean(q)}
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
								size="regular"
								shape="circle"
								children={<IconLocation />}
								backlight
								onClick={myLocation} />
						</li>
						<li className="Home__action">
							<Button
								className="Home__Button"
								theme="black"
								size="regular"
								children="Поиск по местам"
								before={<IconSearch />}
								backlight
								onClick={openSearchResults} />
						</li>
						<li className="Home__action">
							<Button
								className="Home__Button"
								theme="black"
								size="regular"
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
					(results === null)
						? <Title
							className="Home__Title"
							children="Куда ты хочешь сходить?"
							hint="Начни вводить название или адрес" />
						: (Array.isArray(results) && results.length > 0)
							? results.map(renderResult)
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
