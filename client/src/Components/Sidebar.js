import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {AuthContext} from '../GlobalStates'
import "./Sidebar.css"

export const SidebarData = [
    {
      title: "Search",
      path: "/search",
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
  const [authState, setAuthState] = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
      setAuthState();
      alert('logout');
      navigate('/login');
  }

  return (
    <>
     <div className='sidebar'>
     <div>
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
      <div>
      <button className='logout' onClick={logout}>Logout</button>
      </div>
     </div>
    </>
  );
}

export default Sidebar;
