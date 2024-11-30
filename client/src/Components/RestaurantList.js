import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import "./RestaurantList.css"
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';

function RestaurantList({restaurants, onSelectRestaurant, selected}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(selected);

  function handleRestaurantClick(id) {
    if (selectedRestaurant !== id) {
        setSelectedRestaurant(id);
        onSelectRestaurant(id);
    } else {
        setSelectedRestaurant('');
        onSelectRestaurant('');
    }
  }

  useEffect(() => {
    setSelectedRestaurant(selected);
  }, [selected])

  function RatingComponent({rating}) {
    const numStars = parseFloat(rating);
    const wholeStars = Math.floor(numStars);

    return(
    <>
    {Array.from({ length: wholeStars }).map((_, index) => (
            <StarIcon style={{color:'orange'}}/>
    ))}
    {Array.from({ length: Math.ceil(numStars) - wholeStars }).map((_, index) => (
            <StarHalfIcon style={{color:'orange'}}/>
    ))}
    </>
    )

  }

  return (
    <>
     <div>
     <ul className='restaurant-list'>
     {restaurants.map((item, index) => {
           return (
             <li key={item.id} onClick={() => handleRestaurantClick(item.id)}  className={selectedRestaurant === item.id ? 'selected' : ''}>
                 <div style={{display:"flex", flexDirection:"column"}}>
                 <h3 style={{marginLeft:'20px'}}>{item.name}</h3>
                 <div style={{display:"flex", flexDirection:"row"}}>
                     <div style={{display:"flex", flex: 3, flexDirection:"column", marginRight:'20px'}}>
                         <div style={{marginLeft:'20px', marginRight:'20px'}}>
                         <div style={{alignItems: 'center', display: 'flex'}}>
                             <RatingComponent rating={item.rating}/>
                             <span className='rating-review-text'>({item.review_count})</span>
                         </div>
                             <p className='text'>{item.is_open_now ? "Open - " + item.business_hour :"Closed"}</p>
                              <a href= {item.url} className='text'> Yelp page </a>
                         </div>
                     </div>
                     <div style={{display:"flex", flex:1}}>
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
