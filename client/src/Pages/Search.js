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
  const serverBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL;
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
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 13});
  const [mapMarkers, setMapMarkers] = useState([]);

  const [error, setError] = useState('');


  useEffect(()=> {
    //get initial restaurants by posting to search?
    if (authState === undefined) {
        navigate('/login');
    }
    setError('');
    getSearchResults();
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

  async function getSearchResults() {
    setError('');
    setSearchIsPressed(true); // Change color on press
    const possiblePrices = [1, 2, 3, 4];
    const acceptedPrices = possiblePrices.filter(d => prices[d - 1]);

    if (authState === undefined) {
      alert('You are logged out');
      navigate('/login');
    }

    const data = {
        term: search,
        latitude: geolocation.latitude,
        longitude:geolocation.longitude,
        price: acceptedPrices,
        open_now: openNow,
    };
    const searchAPI = `${serverBaseURL}/restaurants/textsearch`;
    try {
        const response = await fetch(searchAPI, {
                       method: 'POST',
                       body: JSON.stringify(data),
                       headers: {'Content-Type': 'application/json',
                                 'Authorization': 'Bearer ' + JSON.stringify(authState.jwt).slice(1, -1)}
                 });
        const result = await response.json();
        console.log(result);
        if (result.status === 'success') {
            if (result.data.restaurants.length === 0) {
                setError('No result found');
                return;
            }

            setResults(result.data.restaurants);

            //setup map
            const mapCenter = result.data.center;
            console.log(mapCenter);
            setMapView({longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 15});
            const markerData = result.data.restaurants.map(r => ({
                business_id: r.business_id,
                longitude: r.coordinates.longitude,
                latitude: r.coordinates.latitude
            }));

            console.log(markerData);
            setMapMarkers(markerData);

        } else {
            setError('Fail to load restaurants');
        }
    } catch (error) {
        console.log('error' + error);
        setError('Fail to load restaurants');
    }
    setTimeout(() => setSearchIsPressed(false), 300); // Reset color after 200ms
  }

  function FilterOptions() {
    return(
        <div>
             <label>
                <Checkbox
                  checked={prices[0]}
                  onChange={() => updatePrices(0)}
                />
                $
              </label>
              <label>
                <Checkbox
                  checked={prices[1]}
                  onChange={() => updatePrices(1)}
                />
                $$
              </label>
              <label>
                <Checkbox
                  checked={prices[2]}
                  onChange={() => updatePrices(2)}
                />
                $$$
              </label>
              <label>
                <Checkbox
                  checked={prices[3]}
                  onChange={() => updatePrices(3)}
                />
                $$$$
              </label>
              <label>
                <Checkbox
                  checked={openNow}
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
         <div style={{position:'fixed', backgroundColor:'white', width:'100vh', display:'block', top:0}}>
         <h1 style={{marginTop: 30}}> SEARCH </h1>
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
         </div>
         <div style={{marginTop: 180}}>
         <ListMapView results={results} mapView={mapView} mapMarkers={mapMarkers} />
         <p>{error === ''? null : error}</p>
         </div>
         </div>
    </div>
  );
}

export default Search;
