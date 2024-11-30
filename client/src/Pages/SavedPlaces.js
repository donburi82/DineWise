import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext} from '../GlobalStates'
import {useNavigate, useLocation} from 'react-router-dom';
import ListMapView from '../Components/RestaurantList-Map';
import SideBar from '../Components/Sidebar';

function SavedPlaces() {

    const navigate = useNavigate();
    const location = useLocation();
    const [authState, setAuthState] = useContext(AuthContext);

    const jwt = authState? JSON.stringify(authState.jwt): null;

    const [results, setResults] = useState();
    const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});
    const [mapMarkers, setMapMarkers] = useState([]);

    return (
      <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
        <SideBar />
       <div className='content-div'>
       <h1> SAVED RESTAURANTS </h1>
       <ListMapView />
       </div>

      </div>
    );
}

export default SavedPlaces;
