import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext} from '../GlobalStates'
import {useNavigate, useLocation} from 'react-router-dom';
import ListMapView from '../Components/RestaurantList-Map';
import SideBar from '../Components/Sidebar';
import {searchSuccess2} from '../Mock/Restaurants';
import './Recommendations.css'

const categories = [
    {
        id:'chinese',
        name: 'Chinese',
        imgPath: 'Chinese.jpg'
    },
    {
        id: 'fast-food',
        name: 'Fast Food',
        imgPath:'FastFood.png'
    }
]



function Recommendations() {

  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);

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
      if (response.status === 'success') {
        console.log('success');

        //how should we deal with 0 results?
        //setup restaurant list
        setResults(response.businesses);

        //setup map
        const mapCenter = response.region.center;
        setMapView({longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 8});
        const markerData = response.businesses.map(b => ({
           id: b.id,
           longitude: b.coordinates.longitude,
           latitude: b.coordinates.latitude
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
        <button onClick={()=>setCategory(item.name)} className='button'>
        <img src={`/images/${item.imgPath}`} alt='img' className='category-img'/>
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

    </div>
  );
}

export default Recommendations;
