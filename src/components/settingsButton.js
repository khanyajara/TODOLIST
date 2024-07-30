import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsButton.css';

function SettingsButton({ userId, setUserId }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = async (action) => {
    setShowMenu(false);
    switch (action) {
      case 'deleteAccount':
        if (window.confirm('Are you sure you want to delete your account?')) {
          try {
            await fetch(`/users/${userId}`, { method: 'DELETE' });
            alert('Account deleted');
            setUserId(null); // Clear user ID
            navigate('/login'); // Redirect to login page
          } catch (error) {
            alert('Error deleting account');
          }
        }
        break;
      case 'register':
        navigate('/register');
        break;
      case 'loginAnotherUser':
        navigate('/login');
        break;
      case 'logout':
        try {
          await fetch('/logout', { method: 'POST' });
          alert('Logged out');
          setUserId(null); // Clear user ID
          navigate('/login'); // Redirect to login page
        } catch (error) {
          alert('Error logging out');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="settings-button-container">
      <button className="button" onClick={handleMenuToggle}>
        {/* SVG icon here */}
        <span className="label">Account</span>
      </button>
      {showMenu && (
        <div className="settings-menu">
          <ul>
            <li>
              <button onClick={() => handleMenuItemClick('deleteAccount')}>Delete Account</button>
            </li>
            <li>
              <button onClick={() => handleMenuItemClick('register')}>Register New Account</button>
            </li>
            <li>
              <button onClick={() => handleMenuItemClick('loginAnotherUser')}>Login Another User</button>
            </li>
            <li>
              <button onClick={() => handleMenuItemClick('logout')}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SettingsButton;
