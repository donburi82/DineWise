import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import "./RestaurantList.css"


function RestaurantList({restaurants, onSelectRestaurant}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  function handleRestaurantClick(id) {
    setSelectedRestaurant(id);
    onSelectRestaurant(id);
  }

  return (
    <>
     <div>
     <ul className='restaurant-list'>
     {restaurants.map((item, index) => {
           return (
             <li key={item.id} onClick={() => handleRestaurantClick(item.id)}>
                 <div style={{display:"flex", flexDirection:"column"}}>
                 <h3>{item.name}</h3>
                 <div style={{display:"flex", flexDirection:"row"}}>
                     <div style={{display:"flex", flexDirection:"column", marginRight:'20px'}}>
                         <span>Rating: {item.rating}</span>
                         <span>Review counts: {item.review_count}</span>
                         <span>{item.is_open_now} | {item.business_hour}</span>
                         <a href= {item.url} />
                         <p>Num fav: {item.num_fav}</p>
                     </div>
                     <div>
                     <img src={item.img} alt='img' className="restaurant-img"/>
                     </div>
                 </div>
                 </div>
             </li>
           );
     })}
     </ul>

     </div>
    </>
  );
}

export default RestaurantList;
