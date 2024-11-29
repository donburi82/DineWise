import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext} from '../GlobalStates'
import './Home.css';
import {useNavigate, useLocation} from 'react-router-dom';
import MapboxMap from '../Components/Map';
import SideBar from '../Components/Sidebar';

function SavedPlaces() {

  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});


  return (
     <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
     <SideBar />
     <div style={{display:"flex", flexDirection: "column", alignItems:"left", margin:"20px"}}>
     <h1> Saved Places </h1>
     <p>{JSON.stringify(authState.jwt)} </p>
      <MapboxMap mapView={mapView}/>
     </div>
    </div>
  );
}

export default SavedPlaces;
