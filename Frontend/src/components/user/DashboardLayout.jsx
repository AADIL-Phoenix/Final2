import React from 'react';
import { NavLink, Outlet, useNavigate ,useParams} from 'react-router-dom';
import './DashboardLayout.css';
import Navbar from '../Navbar';


const DashboardLayout = () => {
  const { name } = useParams();

  
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Do you want to logout?");
    if (confirmed) {
      navigate('/');
    }
  };
  ;
  return (
    <>
      <Navbar isUserDashboard />
      <div className="layout">
        <aside className="sidebar">
          <h2>Hey {name}</h2>
          <ul>
            <li>
              <NavLink to={`/user/${name}/dashboard`} className={({ isActive }) => isActive ? 'active' : ''}>
                🏠 Dashboard
              </NavLink>
              <NavLink to={`/user/${name}/tasks`} className={({ isActive }) => isActive ? 'active' : ''}>
                📋 My Tasks
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                🚪 Logout
              </button>
            </li>
          </ul>
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};
export default DashboardLayout;
