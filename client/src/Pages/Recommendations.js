import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {GeoContext, AuthContext} from '../GlobalStates'
import {useNavigate, useLocation} from 'react-router-dom';
import ListMapView from '../Components/RestaurantList-Map';
import SideBar from '../Components/Sidebar';
import {searchSuccess2} from '../Mock/Restaurants';
import './Recommendations.css'

const categories = [
    {
        id:'gluten_free',
        name: 'gluten_free',
        color: '#469990'
    },
    {
        id: 'halal',
        name: 'halal',
        color: '#dcbeff'
    },
    {
        id: 'kosher',
        name: 'kosher',
        color: '#9A6324'
    },
    {
        id: 'vegan',
        name: 'vegan',
        color: '#808000'
    },
    {
        id: 'vegetarian',
        name: 'vegetarian',
        color: '#fffac8'
    }
]



function Recommendations() {

  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);
  const [geolocation, setGeolocation] = useContext(GeoContext);

  const jwt = authState? JSON.stringify(authState.jwt): null;

  const [results, setResults] = useState();
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});
  const [mapMarkers, setMapMarkers] = useState([]);

  const [category, setCategory] = useState(categories[0].name);

  useEffect(()=> {
    getRecommendations();
  }, [category]);

  function getRecommendations() {
      //post to backend with data
      const data = {
        category: category
      };

      const response = searchSuccess2(data)

       if (response.status === 'success' && response.restaurants.length !== 0) {
           console.log('success');

           setResults(response.restaurants);

           //setup map
           const mapCenter = response.center;
           setMapView({longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 8});
           const markerData = response.restaurants.map(r => ({
               id: r.id,
               longitude: r.coordinates.longitude,
               latitude: r.coordinates.latitude
           }));
           console.log(markerData);
           setMapMarkers(markerData);

       } else {
           console.log('Failed search');
       }
  }

  function CategoriesComponent() {
    return (
        <div className='categories'>
        {categories.map((item) =>
        <div className={category===item.name? 'category-clicked':''}>
        <button onClick={()=>setCategory(item.name)} style={{backgroundColor: item.color}}className='button'>
        <p>{item.name}</p>
        </button>
        </div>
        )}
        </div>
    )
  }


  return (
    <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
      <SideBar />
     <div className='content-div'>
     <h1> RECOMMENDATIONS </h1>
     <CategoriesComponent / >
     <ListMapView results={results} mapView={mapView} mapMarkers={mapMarkers} />
    </div>
    <p>{geolocation.latitude}</p>
    <p>{geolocation.longitude}</p>
    </div>
  );
}

export default Recommendations;
