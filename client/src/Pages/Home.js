import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext} from '../GlobalStates'
import './Home.css';
import {useNavigate, useLocation} from 'react-router-dom';
import MapboxMap from '../Components/Map';
import SideBar from '../Components/Sidebar';
import RestaurantList from '../Components/RestaurantList';
import {searchSuccess1, searchSuccess2} from '../Mock/Restaurants.js';

function Home() {

  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState();
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});

  useEffect(()=> {
    //get initial restaurants by posting to search?
    getSearchResults();

  },[])

  function getSearchResults() {
    console.log('searched');
    //change location, price ...
    getRestaurants(search, 'New York', [1,2,3,4], true, 8);
  }

  function getRestaurants(term, location, price, open_now, open_at) {
        const data = {
            term: term,
            location: location,
            price: price,
            open_now: open_now,
            open_at: open_at
        };
        const response = searchSuccess2(data);
        if (response.status === 'success') {
            console.log('success');
            const mapCenter = response.region.center;
            setMapView({longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 5});
            setResults(response.businesses);
        } else {
            console.log('Failed search');
        }
  }

  function onSelectRestaurant(restaurantID) {
    //highlight restaurant on list and on map
    //map only shows the current restaurants in the list?
    console.log(restaurantID);
  }

  return (
    <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
     <SideBar />
        <div style={{display:"flex", flexDirection: "column", alignItems:"left", margin:"20px"}}>
         <h1> HOME </h1>
          <div >
             <input value={search} onChange={e => setSearch(e.target.value)}/>
             <button onClick={getSearchResults}>
              Search
             </button>
          </div>
         <div style={{display:"flex", flexDirection:"row"}}>
             <div style={{width: '400px' }}>
             {results ? <RestaurantList
             restaurants={results}
             onSelectRestaurant={onSelectRestaurant}
             /> : null}
             </div>
             <div style={{width: '500px', margin: 50}}>
                {results ? <MapboxMap mapView={mapView}/> :null}
             </div>
         </div>
         </div>
    </div>
  );
}

export default Home;
