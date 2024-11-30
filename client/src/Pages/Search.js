import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {AuthContext} from '../GlobalStates'
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

  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [searchIsPressed, setSearchIsPressed] = useState(false);
  const [filterIsPressed, setFilterIsPressed] = useState(false);

  const [openNow, setOpenNow] = useState(true);
  const [prices, setPrices] = useState([1,2,3,4]);

  const [results, setResults] = useState();
  const [mapView, setMapView] = useState({longitude: -73.93,latitude: 40.73, zoom: 10});
  const [mapMarkers, setMapMarkers] = useState([]);


  useEffect(()=> {
    //get initial restaurants by posting to search?
//    getSearchResults();

  },[])

  function updatePrices(price) {
    const p = prices;
    var index = p.indexOf(price);
    if (index > -1) {
        p.splice(index, 1);
    } else{
        p.push(price);
    }
    setPrices(p);
  }

  function getSearchResults() {
    console.log('searched');
    console.log(openNow);
    console.log(prices);
    //change location, price ...
    setSearchIsPressed(true); // Change color on press
    getRestaurants(search, 'New York', [1,2,3,4], true);
    setTimeout(() => setSearchIsPressed(false), 300); // Reset color after 200ms
  }

  function getRestaurants(term, location, price, open_now) {
        const data = {
            term: term,
            location: location,
            price: price,
            open_now: open_now,
        };
        const response = search === 'asdf' ? searchSuccess2(data) : searchSuccess1(data);
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

  function FilterOptions() {
  return(
        <div>
            <label>
              <Checkbox onChange={() => updatePrices(1)} defaultChecked/>
               $
            </label>
            <label>
                <Checkbox  onChange={() => updatePrices(2)} defaultChecked/>
                 $$
            </label>
            <label>
                <Checkbox onChange={() => updatePrices(3)} defaultChecked/>
                 $$$
            </label>
            <label>
              <Checkbox onChange={() => updatePrices(4)} defaultChecked/>
                  $$$$
            </label>
            <label>
                <Checkbox onChange={()=> setOpenNow(!openNow)} defaultChecked/>
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
    </div>
  );
}

export default Search;
