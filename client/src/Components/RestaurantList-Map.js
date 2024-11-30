import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import MapboxMap from './Map';
import RestaurantList from './RestaurantList';

function ListMapView({results, mapView, mapMarkers}) {

  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  useEffect(()=> {
    if (results !== null && results !== undefined && results.length !== 0) {
       setSelectedRestaurant(results[0].id);
    }
  }, [results])

  function onSelectRestaurant(restaurantID) {
    //highlight restaurant on list and on map
    //map only shows the current restaurants in the list?
    console.log('selected restaurant' + restaurantID);
    setSelectedRestaurant(restaurantID);
  }

  function onSelectMapMarker(restaurantID) {
    console.log('selected marker' + restaurantID);
    setSelectedRestaurant(restaurantID);
  }

  return (
     <div style={{display:"flex", flexDirection:"row"}}>
         <div style={{width: '400px' }}>
         {results ? <RestaurantList
                         restaurants={results}
                         onSelectRestaurant={onSelectRestaurant}
                         selected={selectedRestaurant}
                         /> : null}
         </div>
         <div style={{width: '500px', marginLeft: 450, position: 'fixed',}}>
            {results ? <MapboxMap
                        mapView={mapView}
                        mapMarkers={mapMarkers}
                        onSelectMapMarker={onSelectMapMarker}
                        selectedMapMarker={selectedRestaurant}/> :null}
         </div>
     </div>
  );
}

export default ListMapView;
