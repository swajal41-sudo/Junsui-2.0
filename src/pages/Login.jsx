import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Delete } from 'lucide-react';
import '../styles/login.css';

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const PIN_LENGTH = 4;

  const handleLogin = useCallback(async (enteredPin) => {
    if (enteredPin === (import.meta.env.VITE_APP_PIN || '0000')) {
      setError('');
      setLoading(true);
      try {
        await login('admin@gnit.edu', 'password');
        navigate('/');
      } catch (err) {
        setError(`Login failed: ${err.code || err.message}`);
        console.error("FIREBASE ERROR:", err);
        setPin(''); // Reset on fail
      }
      setLoading(false);
    } else {
      setError('Incorrect PIN. Please try again.');
      setTimeout(() => setPin(''), 1000); // Clear pin after 1 second
    }
  }, [login, navigate]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleLogin(pin);
    }
  }, [pin, handleLogin]);

  const handleKeyPress = (num) => {
    if (pin.length < PIN_LENGTH) {
      setError('');
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const renderPinBoxes = () => {
    const boxes = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      const isFilled = i < pin.length;
      boxes.push(
        <div key={i} className={`pin-box ${isFilled ? 'filled' : ''}`}>
          {isFilled ? (showPin ? pin[i] : '•') : ''}
        </div>
      );
    }
    return boxes;
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h1 className="login-hero-title">GNIT Attendance.</h1>
        <p className="login-subtitle">Enter the 4-digit PIN to unlock the system.</p>
        
        {error && <div className="error-alert">{error}</div>}

        <div className="pin-display-container">
          <div className="pin-boxes">
            {renderPinBoxes()}
          </div>
          <button 
            type="button" 
            className="icon-btn" 
            onClick={() => setShowPin(!showPin)}
            aria-label="Toggle PIN visibility"
          >
            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              className="numpad-btn" 
              onClick={() => handleKeyPress(num.toString())}
              disabled={loading || pin.length >= PIN_LENGTH}
            >
              {num}
            </button>
          ))}
          <div className="numpad-empty"></div>
          <button 
            className="numpad-btn" 
            onClick={() => handleKeyPress('0')}
            disabled={loading || pin.length >= PIN_LENGTH}
          >
            0
          </button>
          <button 
            className="numpad-btn numpad-delete" 
            onClick={handleDelete}
            disabled={pin.length === 0 || loading}
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
