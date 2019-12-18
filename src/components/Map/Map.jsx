import React, { useCallback, useRef, useMemo, useEffect } from 'react';

import './Map.css';

import { Map as YMap, ObjectManager, Placemark, YMaps } from 'react-yandex-maps';
import MapProvider from 'components/MapProvider';

import { debounce } from 'helpers/debounce';
import { throttle } from 'helpers/throttle';

const YMAPS_QUERY = { ns: 'ymaps', load: 'package.full' };
const OPTIONS = { suppressMapOpenBlock: true }; // minZoom: 10
const PLACEMARK_OPTIONS = { preset: 'islands#geolocationIcon' };
const OBJECT_MANAGER_PROPS = {
    options: {
        clusterize: true,
        gridSize: 32
    },
    objects: {
        preset: 'islands#greenDotIcon'
    },
    clusters: {
        preset: 'islands#blueClusterIcons'
    }
};

const setBounds = debounce((bounding, ymaps, map, features) => {    
    if (bounding) {
        if (ymaps && map && features.length > 0) {
            const coordinates = features.map((f) => f.geometry.coordinates);

            const bounds = ymaps.util.bounds.fromPoints(coordinates);

            map.setBounds(bounds, {
                checkZoomRange: true,
                zoomMargin: 50,
                duration: 250
            });
        }
    }
}, 150);

const Map = ({ mapState, userGeometry, features, maxHeight, bounding, fetchFeatures, updateMapState, onClick }) => {
    const map = useRef();
    const nextMapState = useRef({});
    const ymaps = useRef();

    const mapStyle = useMemo(() => (maxHeight) ? { height: maxHeight } : undefined, [maxHeight]);

    const fetch = useCallback(throttle(fetchFeatures, 1000), [fetchFeatures]);

    const handleMapLoad = useCallback((ym) => {
        ymaps.current = ym;
        
        if (map.current) {
            const [[topLeftLat, topLeftLng], [botRightLat, botRightLng]] = map.current.getBounds();
            fetch(topLeftLat, topLeftLng, botRightLat, botRightLng);

            map.current.events.add('boundschange', function (e) {
                const [[topLeftLat, topLeftLng], [botRightLat, botRightLng]] = e.originalEvent.newBounds;
                fetch(topLeftLat, topLeftLng, botRightLat, botRightLng);

                nextMapState.current = {
                    center: e.originalEvent.newCenter,
                    zoom: e.originalEvent.newZoom
                };
            });
        }
    }, [map, fetch]);

    const onObjectEvent = useCallback((e) => {
        const objectId = e.get('objectId');
        const feature = features.find(i => i.id === objectId);

        if (feature && feature.geometry.type === 'Point') {
            onClick(feature);
        }
    }, [features, onClick]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => updateMapState(nextMapState.current), []);

    useEffect(() => {
        if (map.current && map.current.container) {
            map.current.container.fitToViewport();
        }
    }, [map, maxHeight]);

    useEffect(() => {
        setBounds(bounding, ymaps.current, map.current, features);
    }, [bounding, ymaps, map, features]);

    return (
        <YMaps query={YMAPS_QUERY}>
            <MapProvider>
                <YMap
                    className="Map"
                    style={mapStyle}
                    state={mapState}
                    options={OPTIONS}
                    instanceRef={map}
                    onLoad={handleMapLoad}>
                    <ObjectManager
                        {...OBJECT_MANAGER_PROPS}
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
