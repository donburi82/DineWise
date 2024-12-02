import React from 'react';
import {useState, useEffect, useContext, useRef} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {AuthContext, GeoContext} from '../GlobalStates';
import "./RestaurantList.css"
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function RestaurantList({restaurants, onSelectRestaurant, selected, onDelete}) {
  const [authState, setAuthState] = useContext(AuthContext);
  const serverBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL;

  const [selectedRestaurant, setSelectedRestaurant] = useState(selected);
  const [openDialog, setOpenDialog] = useState(false);
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [date, setDate] = useState(new Date('January 1, 24 00:00'));

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

   const restaurantRefs = useRef({}); // Ref to store refs for all restaurants

    // Add refs for each restaurant dynamically
    useEffect(() => {
      restaurants.forEach((restaurant) => {
        restaurantRefs.current[restaurant.business_id] = React.createRef();
      });
    }, [restaurants]);

    // Function to check if an element is in view
    function isElementInView(element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      // Check if the element is within the viewport
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowHeight &&
        rect.right <= windowWidth
      );
    }

    // Function to scroll a restaurant into view if needed
    function scrollToRestaurant(business_id) {
      const restaurantElement = restaurantRefs.current[business_id]?.current;
      if (restaurantElement && !isElementInView(restaurantElement)) {
        restaurantElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  useEffect(() => {
      const today = new Date();
      setDate(today);
      if (authState === undefined) {
       alert('You are logged out');
       navigate('/login');
      }
    }, []);

  function handleRestaurantClick(business_id) {
    if (selectedRestaurant !== business_id) {
        setSelectedRestaurant(business_id);
        onSelectRestaurant(business_id);
    } else {
        setSelectedRestaurant('');
        onSelectRestaurant('');
    }
  }

  useEffect(() => {
    setSelectedRestaurant(selected);
    scrollToRestaurant(selected);
  }, [selected]);

  useEffect(() => {
    getSavedRestaurants();
  }, [restaurants]);

  async function getSavedRestaurants() {
    //post to user to get saved list
    const favoritesAPI = `${serverBaseURL}/favorites/`;
    try {
       const response = await fetch(favoritesAPI, {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.stringify(authState.jwt).slice(1, -1)}
       });
       const result = await response.json();
       console.log(result);
       if (result.status === 'success') {
         const restaurantIds = result.data.map(d => d.business_id);
         setSavedRestaurants(restaurantIds);
       } else {
           console.log('Find favorites failed');
       }
    } catch (error) {
       console.log('error' + error);
    }
  }

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
    { numStars === 5 ? null : Array.from({ length: Math.floor(5 - numStars) }).map((_, index) => (
            <StarBorderIcon style={{color:'orange'}}/>
    ))
    }
    </>
    )

  }

  async function handleSave(business_id) {
      const favoritesAPI = `${serverBaseURL}/favorites/`;
      const isSaved = savedRestaurants.includes(business_id);

      try {
          const response = await fetch(favoritesAPI, {
              method: isSaved ? 'DELETE' : 'POST', // Use DELETE if the restaurant is already saved, POST otherwise
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.stringify(authState.jwt).slice(1, -1),
              },
              body: JSON.stringify({ restaurantId: business_id }),
          });
          const result = await response.json();
          console.log(result);

          if (result.status === 'success') {
              // Update the state based on whether we're adding or removing
              setSavedRestaurants((prevSaved) =>
                  isSaved
                      ? prevSaved.filter((id) => id !== business_id) // Remove the ID
                      : [...prevSaved, business_id] // Add the ID
              );
              if (isSaved && onDelete !== undefined) {
                onDelete();
              }
          } else {
              alert(result.msg);
              console.log(result.msg);
          }
      } catch (error) {
          console.log('error' + error);
          alert('error' + error);
      }
  }


  function getOpenNow(business_hours) {
      const day = daysOfWeek[date.getDay()];
      const hour = date.getHours();
      const minute = date.getMinutes();
      var open = false;
      var openTill = '';
      const schedule = business_hours.map(d => {
        const start = parseTime(d.start);
        const end = parseTime(d.end);
        if (start.hour === 0 & end.hour === 0) {
            end.hour = 23;
            end.minutes= 59;
        }
        return ({
            day: d.day,
            startH: start.hour,
            startM: start.minutes,
            endH: end.hour,
            endM: end.minutes,
        });
      });

      for (var i = 0; i < schedule.length; i++) {
         const openHours = schedule[i];
         if (openHours.day === day) {
         console.log('here');
             if (openHours.startH > hour || openHours.endH < hour) {
                break; //closed
             }
             if ( openHours.startH === hour &&  openHours.startM > minute ) {
                break;
             }
             if ( openHours.endH === hour &&  openHours.endM < minute ) {
                break;
             }
             open = true;
             openTill = openHours.endH.toString() + ':' + openHours.endM.toString();
         }
      }

      if (open) {
        return "OPEN - " + openTill;
      }
      return "CLOSED";
  }

  function parseTime(timeString) {
    return {hour: parseInt(timeString.slice(0,2)), minutes: parseInt(timeString.slice(2, 4))};
  }

  return (
    <>
     <div>
     <ul className='restaurant-list'>
     {restaurants.map((item, index) => {
           return (
             <li key={item.business_id}
             ref={restaurantRefs.current[item.business_id]}
             onClick={() => handleRestaurantClick(item.business_id)}
             className={selectedRestaurant === item.business_id ? 'selected' : ''}>
                  <div style={{display:"flex", flexDirection:"row"}}>
                  <button className="save-button" onClick={() => handleSave(item.business_id)}>
                  {savedRestaurants.includes(item.business_id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </button>

                 <div style={{display:"flex", flexDirection:"column", wordBreak: 'break-word'}}>
                 <h3 style={{marginLeft:'20px', marginRight: '20px'}}>{item.name}</h3>
                 <div style={{display:"flex", flexDirection:"row"}}>

                     <div style={{display:"flex", flex: 3, flexDirection:"column", marginRight:'20px'}}>
                         <div style={{marginLeft:'20px', marginRight:'20px',  display: 'flex', flexDirection:'column' }}>
                         <div style={{alignItems: 'center', display: 'flex'}}>
                             <RatingComponent rating={item.rating}/>
                             <span className='rating-review-text'>({item.review_count})</span>
                         </div>
                             <p className='text'>{getOpenNow(item.business_hours)}</p>
                              <a href= {item.url} className='yelp-link'> Yelp page </a>
                         </div>
                     </div>
                     <div style={{display:"flex", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <img src={item.image_url} alt='img' className="restaurant-img"/>
                     </div>
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
