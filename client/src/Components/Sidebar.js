import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import "./Sidebar.css"

export const SidebarData = [
    {
      title: "Home",
      path: "/home",
      cName: "nav-text",
    },
    {
      title: "Recommendations",
      path: "/recommendations",
      cName: "nav-text",
    },
    {
      title: "Saved Places",
      path: "/savedPlaces",
      cName: "nav-text",
    }
 ];

function Sidebar() {
  const location = useLocation();
console.log(location.pathname);
  return (
    <>
     <div className='sidebar'>
      <div>
      <p className='username'>User name</p>
      </div>
      <nav>
         <ul className='nav-group'>
         {SidebarData.map((item, index) => {
               return (
                 <li key={index}>
                   <Link  className={location.pathname === item.path ? 'active': 'nav-text'} to={item.path}>
                     <span>{item.title}</span>
                   </Link>
                 </li>
               );
             })}
         </ul>
      </nav>
     </div>
    </>
  );
}

export default Sidebar;
