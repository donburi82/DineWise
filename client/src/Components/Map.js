import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
//import ReactMapGL from 'react-map-gl';
import Map, {Marker, ScaleControl} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';

function MapboxMap({mapView, mapMarkers, onSelectMapMarker, selectedMapMarker}) {
  const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const location = useLocation();
  const jwt = location.state;
  const [viewState, setViewState] =  useState(mapView);
  const [markers, setMarkers] = useState(mapMarkers);
  const [selectedMarker, setSelectedMarker] = useState(selectedMapMarker);

  const mapRef = useRef();

  function positionInViewport(marker) {

    const bounds = mapRef.current? mapRef.current.getBounds() : null;
    if (bounds === null) {
        return false;
    }
    return bounds.contains([marker.longitude, marker.latitude]);
  }

  useEffect(() => {
     setViewState(mapView);
  }, [mapView])

  useEffect(() => {
    setMarkers(mapMarkers);
    setSelectedMarker(selectedMapMarker);
    if (selectedMapMarker !== '') {
        const selected = mapMarkers.filter(item => item.id == selectedMapMarker)[0];
        if (!positionInViewport(selected)) {
            setViewState(state => ({...state,
                longitude: selected.longitude,
                latitude: selected.latitude }));
        }
    }
  }, [mapMarkers, selectedMapMarker])

  function Markers() {
    if (markers.length === 0) {
    return null;
    }
//    const currMarkers = selectedMarker === '' ? markers: markers.filter(item => item.id == selectedMarker);
    const currMarkers = markers;

    return (
        <>
        {currMarkers.map((item) => {
        return MarkerComponent(item);
        })}
        </>
    );
  }

  function onMarkerClick(marker) {
    if (marker.id === selectedMarker) {
        //unselect marker
        setSelectedMarker('');
        onSelectMapMarker('');
//        setViewState(mapView);
    }  else {
        //select a different marker
        setSelectedMarker(marker.id);
        onSelectMapMarker(marker.id);
//        setViewState(state => ({zoom: state.zoom + 0.3, longitude: marker.longitude, latitude: marker.latitude }));
    }
  }

  function MarkerComponent(item) {
    return (<Marker longitude={item.longitude} latitude={item.latitude} anchor="bottom" onClick={()=>onMarkerClick(item)} >
               <RoomIcon style={{ color: item.id === selectedMarker ? 'red' : 'gray', fontSize:'40px' }} />
           </Marker>);
  }


  return (
    <>
    <div style={{width: "500px", height: "400px"}} >

       <Map reuseMaps
          ref = {mapRef}
          mapboxAccessToken= {TOKEN}
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapStyle='mapbox://styles/mapbox/streets-v12'
        >
        <Markers />
       </Map>
    </div>
    </>
  );
}

export default React.memo(MapboxMap);
