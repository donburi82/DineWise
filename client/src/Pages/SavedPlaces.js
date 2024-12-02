import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext} from '../GlobalStates'
import {useNavigate, useLocation} from 'react-router-dom';
import ListMapView from '../Components/RestaurantList-Map';
import SideBar from '../Components/Sidebar';

function SavedPlaces() {
    const serverBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL;

    const navigate = useNavigate();
    const location = useLocation();
    const [authState, setAuthState] = useContext(AuthContext);


    const [results, setResults] = useState();
    const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});
    const [mapMarkers, setMapMarkers] = useState([]);

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (authState === undefined) {
          alert('You are logged out');
          navigate('/login');
        }
        setMessage('');
        getSavedRestaurants();

    },[])

    async function getSavedRestaurants() {
        const favoritesAPI = `${serverBaseURL}/favorites/`;
        try {
           const response = await fetch(favoritesAPI, {
              method: 'GET',
              headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + JSON.stringify(authState.jwt).slice(1, -1)}
           });
           const result = await response.json();
           console.log(result);
           if (result.status === 'success') {
             if (result.data.length === 0){
                setMessage('No saved places yet.');
                return;
             }
             setResults(result.data);
             const mapCenter = result.data[0].coordinates;
             console.log(mapCenter);
             setMapView({longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 12});
             const markerData = result.data.map(r => ({
                 business_id: r.business_id,
                 longitude: r.coordinates.longitude,
                 latitude: r.coordinates.latitude
             }));
             console.log(markerData);
             setMapMarkers(markerData);
           } else {
               alert('error loading favorites');
           }
        } catch (error) {
           console.log('error' + error);
        }
    }

    function onDelete() {
        setMessage('');
        getSavedRestaurants();
    }

    return (
      <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
        <SideBar />
       <div className='content-div'>
       <div style={{display:'block', position:'fixed', width:'100vh', backgroundColor: 'white', top:0}}>
       <h1 style={{marginTop: 30}}> SAVED PLACES </h1>
       <p> {message === ''? null : message} </p>
       </div>
       <div style={{marginTop:100}}>
       <ListMapView results={results} mapView={mapView} mapMarkers={mapMarkers} onDelete={onDelete}/>
       </div>
       </div>

      </div>
    );
}

export default SavedPlaces;
