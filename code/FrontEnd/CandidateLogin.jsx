import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CandidateLogin.css';

const CandidateLogin = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('enter_mobile'); // enter_mobile → confirm_join → enter_otp
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
      const response = await fetch('http://localhost/evoting/check_first_contact.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.allowed) {
        const otpResponse = await fetch('http://localhost/evoting/send_otp.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile }),
        });

        const otpData = await otpResponse.json();

        if (otpData.success) {
          setStep('enter_otp');
          setError('');
        } else {
          setError('Failed to send OTP. Try again.');
        }
      } else {
        setError(
          "We haven't received your join message yet. Please send 'join language-prepare' to +1 415 523 8886 on WhatsApp."
        );
      }
    } catch (err) {
      console.error('Verification check error:', err);
      setError('Server error. Try again after some time.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost/evoting/verify_otp.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/candidate-profile', { state: { mobile } });
      } else {
        setError('Invalid OTP. Try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Connection error. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className="login-modal">
        <h2>Candidate Login (WhatsApp OTP)</h2>
        {error && <div className="error-message">{error}</div>}

        {step === 'enter_mobile' && (
          <form onSubmit={handleMobileSubmit}>
            <div className="input-group">
              <label>Registered Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
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
              Send the message:
              <strong> join language-prepare </strong>
              to <strong>+1 415 523 8886</strong> on WhatsApp.
            </p>
            <p>After sending the message, click the button below.</p>

            <button
              className="btn login-btn"
              onClick={handleConfirmJoin}
              disabled={isLoading}
            >
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
                placeholder="Check your WhatsApp"
                maxLength="6"
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

export default CandidateLogin;
