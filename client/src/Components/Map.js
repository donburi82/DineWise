import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
//import ReactMapGL from 'react-map-gl';
import Map, {Marker, ScaleControl} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapboxMap({mapView}) {
  const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const location = useLocation();
  const jwt = location.state;
  const [viewState, setViewState] =  useState(mapView);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (
          viewState.latitude !== mapView.latitude ||
          viewState.longitude !== mapView.longitude ||
          viewState.zoom !== mapView.zoom
        ) {
          setViewState(mapView);
     }
  }, [mapView])


  function MapComponent() {
   return(
   <div style={{width: "500px", height: "400px"}} >

   <Map reuseMaps
      mapboxAccessToken= {TOKEN}
      {...viewState}
      onMove={(event) => setViewState(event.viewState)}
      mapStyle='mapbox://styles/mapbox/streets-v12'

    >
      <Marker longitude={ -73.93} latitude={40.73} anchor="bottom" >
        <img src="./pin.png" />
      </Marker>
    </Map>
    </div>
    )
  }

  return (
    <>
    <MapComponent />
    </>
  );
}

export default React.memo(MapboxMap);
