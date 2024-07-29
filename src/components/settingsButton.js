import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsButton.css';

function SettingsButton() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (action) => {
    setShowMenu(false);
    switch (action) {
      case 'deleteAccount':
        // Add logic to delete account
        alert('Delete account clicked');
        navigate('/login'); // Redirect to login page
        break;
      case 'register':
        navigate('/register'); // Redirect to register page
        break;
      case 'loginAnotherUser':
        navigate('/login'); // Redirect to login page
        break;
      case 'logout':
        alert('Logout clicked');
        navigate('/login'); // Redirect to login page
        break;
      default:
        break;
    }
  };

  return (
    <div className="settings-button-container">
      <button className="button" onClick={handleMenuToggle}>
        <svg
          className="svg-icon"
          fill="none"
          height="20"
          viewBox="0 0 20 20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="white" strokeLinecap="round" strokeWidth="1.5">
            <circle cx="10" cy="10" r="2.5"></circle>
            <path
              clipRule="evenodd"
              d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z"
              fillRule="evenodd"
            ></path>
          </g>
        </svg>
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
