import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import MapboxMap from './Map';
import RestaurantList from './RestaurantList';

function ListMapView({results, mapView, mapMarkers, onDelete}) {

  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  useEffect(()=> {
    if (results !== null && results !== undefined && results.length !== 0) {
       setSelectedRestaurant(results[0].business_id);
    }
  }, [results])

  function onSelectRestaurant(restaurantID) {
    setSelectedRestaurant(restaurantID);
  }

  function onSelectMapMarker(restaurantID) {
    setSelectedRestaurant(restaurantID);
  }

  return (
     <div style={{display:"flex", flexDirection:"row"}}>
         <div style={{width: '450px' }}>
         {results ? <RestaurantList
                         restaurants={results}
                         onSelectRestaurant={onSelectRestaurant}
                         selected={selectedRestaurant}
                         onDelete={onDelete}
                         /> : null}
         </div>
         <div style={{width: '550px', marginLeft: 480, position: 'fixed',}}>
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
