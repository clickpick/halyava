import React, { useEffect } from 'react';
import { string } from 'prop-types';

import './Home.css';

import ymaps from 'ymaps';

import API from 'services/api';

import { Panel, PanelHeader } from '@vkontakte/vkui';

const Home = ({ id }) => {

	useEffect(() => {
		ymaps
			.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU')
			.then(async (maps) => {
				const myMap = new maps.Map('map', {
					center: [55.76, 37.64],
					zoom: 5,
					controls: ['zoomControl']
				});
				const MyIconContentLayout = maps.templateLayoutFactory.createClass(
					'<div style="position: absolute; background-size: cover; box-shadow: 0 0 10px rgba(0,0,0,.3); background-image: url($[properties.iconContent]); width: 24px; height: 24px; top: -12px; left: -12px; border-radius: 100%; overflow: hidden;"></div>'
				);
				maps.layout.storage.add('myLayout', MyIconContentLayout);

				const yellowCollection = new maps.ObjectManager({ clusterize: true });

				const bounds = myMap.getBounds();
				const [topLeftLat, topLeftLng] = bounds[0];
				const [botRightLat, botRightLng] = bounds[1];

				myMap.geoObjects.add(yellowCollection);
				
				try {
					const data = await API.map(topLeftLat, topLeftLng, botRightLat, botRightLng);
					yellowCollection.add(data);
				} catch (e) {}

				function onObjectEvent(e) {
					var objectId = e.get('objectId'),
						objectGeometry = yellowCollection.objects.getById(objectId).geometry.type;
					// Если событие произошло на метке, изменяем цвет ее иконки.
					if (objectGeometry === 'Point') {
						console.log(1);
						yellowCollection.objects.setObjectOptions(objectId, {
							preset: 'islands#yellowIcon'
						});
					}
				}

				yellowCollection.objects.events.add(['click'], onObjectEvent);

				myMap.events.add('boundschange', async function () {
					const bounds = myMap.getBounds();
					const [topLeftLat, topLeftLng] = bounds[0];
					const [botRightLat, botRightLng] = bounds[1];

					try {
						const data = await API.map(topLeftLat, topLeftLng, botRightLat, botRightLng);
						yellowCollection.add(data);
					} catch (e) { }
				});
			});
	}, []);

	return (
		<Panel id={id} className="Home">
			<PanelHeader noShadow={true} />
			<div id="map" className="Home__map" />
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
};

export default Home;
