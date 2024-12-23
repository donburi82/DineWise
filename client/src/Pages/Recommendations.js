import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {GeoContext, AuthContext} from '../GlobalStates'
import {useNavigate, useLocation} from 'react-router-dom';
import ListMapView from '../Components/RestaurantList-Map';
import SideBar from '../Components/Sidebar';
import './Recommendations.css'

const categories = [
    {
        id:'Gluten_free',
        name: 'gluten_free',
        color: '#469990',
        textColor: 'white'
    },
    {
        id: 'Halal',
        name: 'halal',
        color: '#dcbeff'
    },
    {
        id: 'Kosher',
        name: 'kosher',
        color: '#9A6324',
        textColor: 'white'
    },

    {
        id: 'Vegetarian',
        name: 'vegetarian',
        color: '#fffac8'
    },

    {
        id: 'Vegan',
        name: 'vegan',
        color: '#808000',
        textColor: 'white'
    }
]

function Recommendations() {
  const serverBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);
  const [geolocation, setGeolocation] = useContext(GeoContext);

  const [results, setResults] = useState();
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});
  const [mapMarkers, setMapMarkers] = useState([]);

  const [category, setCategory] = useState(categories[0].name);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authState === undefined) {
      alert('You are logged out');
      navigate('/login');
    }
  },[])

  useEffect(()=> {
    getRecommendations();
  }, [category]);

  async function getRecommendations() {
      //post to backend with data
      console.log(category);
      setError('');
      setResults();
      const data = {
        longitude: geolocation.longitude,
        latitude:geolocation.latitude,
        category: category
      };

      const categorySearchAPI = `${serverBaseURL}/restaurants/categorysearch`;
      try {
          const response = await fetch(categorySearchAPI, {
                         method: 'POST',
                         body: JSON.stringify(data),
                         headers: {'Content-Type': 'application/json',
                                   'Authorization': 'Bearer ' + JSON.stringify(authState.jwt).slice(1, -1)}
          });
          const result = await response.json();
          if (result.status === 'success') {
                if (result.data.restaurants.length === 0) {
                   setError('No suggested restaurants');
                   return;
                }
               setResults(result.data.restaurants);
               //setup map
               const mapCenter = result.data.center;
               setMapView({longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 15});
               const markerData = result.data.restaurants.map(r => ({
                   business_id: r.business_id,
                   longitude: r.coordinates.longitude,
                   latitude: r.coordinates.latitude
               }));
               setMapMarkers(markerData);
          } else {
               setError('Fail to load restaurants');
               console.log('Failed search');
          }
      } catch (error) {
        console.log('error:' + error);
        setError('Fail to load restaurants');
      }
  }

  function CategoriesComponent() {
    return (
        <div className='categories'>
        {categories.map((item) =>
        <div>
        <button onClick={()=>setCategory(item.name)}
        style={{backgroundColor: category === item.name? 'white': item.color,
                border: category === item.name? 3: 0,
                borderStyle: 'solid',
                borderColor: 'blue'}} className='button'>
        <p style={{color: category === item.name?'blue': item.textColor,
         margin:20, fontSize:15}}>{item.name}</p>
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
     <div style={{position:'fixed', backgroundColor:'white', width:'100vh', display:'block', top:0}}>
     <h1  style={{marginTop: 30}}> RECOMMENDATIONS </h1>
     <CategoriesComponent / >
     </div>
     <div style={{marginTop: 180}}>
     {error !== '' ? <p>{error}</p>:null}
     <ListMapView results={results} mapView={mapView} mapMarkers={mapMarkers} />
     </div>
    </div>
    </div>
  );
}

export default Recommendations;
