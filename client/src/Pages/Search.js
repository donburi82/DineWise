import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext, GeoContext} from '../GlobalStates';
import './Search.css';
import {useNavigate, useLocation} from 'react-router-dom';
import MapboxMap from '../Components/Map';
import SideBar from '../Components/Sidebar';
import ListMapView from '../Components/RestaurantList-Map';
import RestaurantList from '../Components/RestaurantList';
import {searchSuccess1, searchSuccess2} from '../Mock/Restaurants.js';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import Checkbox from '@mui/material/Checkbox';


function Search() {

  const [geolocation, setGeolocation] = useContext(GeoContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [searchIsPressed, setSearchIsPressed] = useState(false);
  const [filterIsPressed, setFilterIsPressed] = useState(false);

  const [openNow, setOpenNow] = useState(true);
  const [prices, setPrices] = useState([true, true, true, true]);

  const [results, setResults] = useState();
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});
  const [mapMarkers, setMapMarkers] = useState([]);


  useEffect(()=> {
    //get initial restaurants by posting to search?
//    getSearchResults();

  },[])

  useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGeolocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          }
        );
      } else {
        console.error('Geolocation not supported by your browser.');
      }
    }, []);

  function updatePrices(index) {
    setPrices((prevPrices) =>
     prevPrices.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  function getSearchResults() {
    console.log('searched');
    console.log(openNow);
    console.log(prices);

    setSearchIsPressed(true); // Change color on press
    const possiblePrices = [1, 2, 3, 4];
    const acceptedPrices = possiblePrices.filter(d => prices[d - 1]);
    console.log(acceptedPrices);

    const data = {
        term: search,
        latitude: geolocation.latitude,
        longitude:geolocation.longitude,
        price: acceptedPrices,
        open_now: openNow,
    };

    const response = search === 'asdf' ? searchSuccess2(data) : searchSuccess1(data);
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
    setTimeout(() => setSearchIsPressed(false), 300); // Reset color after 200ms
  }

  function FilterOptions() {
  return(
        <div>
             <label>
                <Checkbox
                  checked={prices[0]} // Controlled by state
                  onChange={() => updatePrices(0)}
                />
                $
              </label>
              <label>
                <Checkbox
                  checked={prices[1]} // Controlled by state
                  onChange={() => updatePrices(1)}
                />
                $$
              </label>
              <label>
                <Checkbox
                  checked={prices[2]} // Controlled by state
                  onChange={() => updatePrices(2)}
                />
                $$$
              </label>
              <label>
                <Checkbox
                  checked={prices[3]} // Controlled by state
                  onChange={() => updatePrices(3)}
                />
                $$$$
              </label>
              <label>
                <Checkbox
                  checked={openNow} // Controlled by state
                  onChange={() => setOpenNow(!openNow)}
                />
                open_now
              </label>
        </div>
        );
  }
  return (
    <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
     <SideBar />
        <div className='content-div'>
         <h1> SEARCH </h1>
          <div style={{marginBottom: 5, display: 'flex', alignItems: 'center'}}>
             <input className='textbox' value={search} onChange={e => setSearch(e.target.value)}/>
             <button onClick={()=> setFilterIsPressed(!filterIsPressed)} className='button'>
               <TuneIcon className= {filterIsPressed? 'button-pressed': 'button-unpressed'}/>
             </button>
            <button onClick={getSearchResults} className='button'>
               <SearchIcon className= {searchIsPressed? 'button-pressed': 'button-unpressed'}/>
              </button>
          </div>
          { filterIsPressed ?<FilterOptions />: null}
         <ListMapView results={results} mapView={mapView} mapMarkers={mapMarkers} />
         </div>
         <p>{geolocation.latitude}</p>
         <p>{geolocation.longitude}</p>
    </div>
  );
}

export default Search;
