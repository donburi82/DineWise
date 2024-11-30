import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import "./RestaurantList.css"
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Dialog from '@mui/material/Dialog';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

function RestaurantList({restaurants, onSelectRestaurant, selected}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(selected);
  const [openDialog, setOpenDialog] = useState(false);

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

  function handleSave(id) {
    setOpenDialog(true);
  }
  function handleClose (value) {
      setOpenDialog(false);
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
                         <div style={{marginLeft:'20px', marginRight:'20px',  display: 'flex', flexDirection:'column' }}>
                         <div style={{alignItems: 'center', display: 'flex'}}>
                             <RatingComponent rating={item.rating}/>
                             <span className='rating-review-text'>({item.review_count})</span>
                         </div>
                             <p className='text'>{item.is_open_now ? "Open - " + item.business_hour :"Closed"}</p>
                              <a href= {item.url} className='text'> Yelp page </a>
                              <button className="save-button" onClick={()=>handleSave(item.id)}>{item.saved? 'Saved': 'Save food place'}</button>
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
     <Dialog open={openDialog} onClose={handleClose}>
     <p>Save?</p>
     </Dialog>
    </>
  );
}

export default RestaurantList;