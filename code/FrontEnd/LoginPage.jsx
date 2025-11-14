import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('enter_mobile'); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setStep('confirm_join');
  };

  const handleConfirmJoin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const checkResponse = await fetch('http://localhost/evoting/check_first_contact.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await checkResponse.json();
      console.log("Check Join Response:", data);

      if (!data.allowed) {
        setError("We haven't received your join message yet. Send 'join language-prepare' to +1 415 523 8886.");
        setIsLoading(false);
        return;
      }

      const otpResponse = await fetch('http://localhost/evoting/send_otp.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const otpData = await otpResponse.json();
      console.log("OTP Response:", otpData);

      if (otpData.success) {
        setStep('enter_otp');
        setError('');
      } else {
        setError('Failed to send OTP, try again.');
      }

    } catch (err) {
      console.error("Error Checking Join:", err);
      setError('Server connection error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/evoting/verify_otp.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await response.json();
      console.log("OTP Verify Response:", data);

      if (data.success) {
        navigate('/profile', { state: { mobile } });
      } else {
        setError('Incorrect OTP, try again.');
      }

    } catch (err) {
      console.error("OTP Verify Error:", err);
      setError('Network failure. Try later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

      <div className="login-modal">
        <h2>Voter Login Using WhatsApp OTP</h2>
        {error && <div className="error-message">{error}</div>}

        {step === 'enter_mobile' && (
          <form onSubmit={handleMobileSubmit}>
            <div className="input-group">
              <label>Registered Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                maxLength="10"
                placeholder="Enter 10-digit number"
                required
              />
            </div>
            <button type="submit" className="btn login-btn">
              Continue
            </button>
          </form>
        )}

        {step === 'confirm_join' && (
          <div className="confirm-screen">
            <p>
              Send: <strong>"join language-prepare"</strong> on WhatsApp<br/>
              To: <strong>"+1 415 523 8886"</strong><br/>
            </p>
            <p>After sending, press the button below</p>

            <button className="btn login-btn" onClick={handleConfirmJoin} disabled={isLoading}>
              {isLoading ? 'Checking...' : 'I have sent the message'}
            </button>
          </div>
        )}

        {step === 'enter_otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="input-group">
              <label>Enter OTP</label>
              <input
                type="tel"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength="6"
                placeholder="Enter OTP from WhatsApp"
                required
              />
            </div>
            <button className="btn login-btn" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
