import React, { useCallback } from 'react';
import { string, func } from 'prop-types';

import './Home.css';

import { useSelector, useDispatch } from 'react-redux';
import { getMapState, getMapFeatures } from 'reducers/map-reducer';
import { fetchFeatures } from 'actions/map-actions';

import { Panel, PanelHeader } from '@vkontakte/vkui';
import Map from 'components/Map';

const Home = ({ id, goShop }) => {
	const mapState = useSelector(getMapState);
	const features = useSelector(getMapFeatures);

	const dispatch = useDispatch();

	const setFeatures = useCallback(function () {		
		dispatch(fetchFeatures(...arguments));
	}, [dispatch]);
	
	return (
		<Panel id={id} className="Home">
			<PanelHeader noShadow={true} />
			<Map
				className="Home__Map"
				mapState={mapState}
				features={features}
				fetchFeatures={setFeatures}
				onClick={goShop} />
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
	goShop: func.isRequired
};

export default Home;
