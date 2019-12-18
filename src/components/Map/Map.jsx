import React, { useCallback, useRef, useEffect } from 'react';

import './Map.css';

import { Map as YMap, ObjectManager, Placemark, YMaps } from 'react-yandex-maps';
import MapProvider from 'components/MapProvider';

const OPTIONS = { suppressMapOpenBlock: true }; // minZoom: 10
const PLACEMARK_OPTIONS = { preset: 'islands#geolocationIcon' };

const Map = ({ mapState, userGeometry, features, fetchFeatures, updateMapState, onClick }) => {
    const map = useRef();
    const nextMapState = useRef({});

    const handleMapLoad = useCallback(() => {
        if (map.current) {
            const [[topLeftLat, topLeftLng], [botRightLat, botRightLng]] = map.current.getBounds();
            fetchFeatures(topLeftLat, topLeftLng, botRightLat, botRightLng);

            map.current.events.add('boundschange', function (e) {
                const [[topLeftLat, topLeftLng], [botRightLat, botRightLng]] = e.originalEvent.newBounds;
                fetchFeatures(topLeftLat, topLeftLng, botRightLat, botRightLng);
                nextMapState.current = {
                    center: e.originalEvent.newCenter,
                    zoom: e.originalEvent.newZoom
                };
            });
        }
    }, [map, fetchFeatures]);

    const onObjectEvent = useCallback((e) => {
        const objectId = e.get('objectId');
        const feature = features.find(i => i.id === objectId);

        if (feature && feature.geometry.type === 'Point') {
            onClick(feature);
        }
    }, [features, onClick]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => updateMapState(nextMapState.current), []);

    return (
        <YMaps query={{ns: 'ymaps', load: 'package.full'}}>
            <MapProvider>
                <YMap
                    className="Map"
                    state={mapState}
                    options={OPTIONS}
                    instanceRef={map}
                    onLoad={handleMapLoad}>
                    <ObjectManager
                        options={{
                            clusterize: true,
                            gridSize: 32,
                        }}
                        objects={{
                            preset: 'islands#greenDotIcon',
                        }}
                        clusters={{
                            preset: 'islands#blueClusterIcons',
                        }}
                        onClick={onObjectEvent}
                        features={features} />

                    {(userGeometry) &&
                        <Placemark
                            geometry={{
                                type: 'Point',
                                coordinates: userGeometry
                            }}
                            options={PLACEMARK_OPTIONS} />}
                </YMap>
            </MapProvider>
        </YMaps>
    );
};

export default Map;
