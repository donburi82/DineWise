import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './Home.css';
import {useNavigate, useLocation} from 'react-router-dom';
import ReactMapGL from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Home() {
  const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const mapRef = useRef()
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = location.state;

  useEffect(() => {
      mapboxgl.accessToken = TOKEN;
      mapRef.current = new mapboxgl.Map({
       container: 'map-container',
       style: 'mapbox://styles/mapbox/streets-v12',
       zoom: 8,
       center: [-73.93, 40.73]
   });


      return () => {
        mapRef.current.remove()
      }
    }, []);

  return (
    <>
     <div style={{display:"flex", flexDirection: "column", alignItems:"left", margin:"20px"}}>
     <h1> HOME </h1>
     <p>{JSON.stringify(jwt)} </p>
     </div>
     <div style={{width: "400px", height: "300px"}} id='map-container' ref={mapRef}>
     </div>
    </>
  );
}

export default Home;
