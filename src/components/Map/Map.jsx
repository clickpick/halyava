import React, { useRef, useCallback } from 'react';

import './Map.css';

import { YMaps, Map as YMap, ObjectManager } from 'react-yandex-maps';
import MapProvider from 'components/MapProvider';

const OPTIONS = { minZoom: 10 };

const Map = React.memo(({ mapState, features, fetchFeatures, onClick }) => {
    const map = useRef();
    
    const handleMapLoad = useCallback(() => {
        if (map.current) {
            const [[topLeftLat, topLeftLng], [botRightLat, botRightLng]] = map.current.getBounds();
            fetchFeatures(topLeftLat, topLeftLng, botRightLat, botRightLng);

            map.current.events.add('boundschange', function (e) {
                const [[topLeftLat, topLeftLng], [botRightLat, botRightLng]] = e.originalEvent.newBounds;
                fetchFeatures(topLeftLat, topLeftLng, botRightLat, botRightLng);
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

    return (
        <YMaps query={{ ns: 'ymaps', load: 'package.full' }}>
            <MapProvider>
                <YMap
                    className="Map"
                    defaultState={mapState}
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
                        features={features}
                    />
                </YMap>
            </MapProvider>
        </YMaps>
    );
});

export default Map;