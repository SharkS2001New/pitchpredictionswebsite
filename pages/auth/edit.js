import React, { useState, useEffect } from 'react';
import api from '../../components/auth/api';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import withAuth from './checkAuth';
import AuthPreloader from './includes/auth_preLoader';
import countries from '../../components/auth/countries';

function EditProfile() {
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [countryError, setCountryError] = useState('');

  const [loading, setLoading] = useState(false); // State for preloader
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get(null);
    if (cookies.user) {
      const userData = JSON.parse(cookies.user);
      setName(userData.full_name || '');
      setEmail(userData.email || '');
      setPhoneNumber(userData.phone_number || '');
      setCountry(userData.country || '');
    } else {
      router.push('/auth/dashboard');
    }
  }, [router]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let hasError = false;
    setNameError('');
    setEmailError('');
    setPhoneNumberError('');
    setCountryError('');

    if (!full_name.trim()) {
      setNameError('Please enter your full name.');
      hasError = true;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!phone_number.trim()) {
      setPhoneNumberError('Please enter your phone number.');
      hasError = true;
    }

    if (!country) {
      setCountryError('Please select a country.');
      hasError = true;
    }

    return !hasError;
  };

  // Function to include token in request headers
  const setAuthToken = () => {
    const cookies = nookies.get();
    return cookies.token ? { Authorization: `Bearer ${cookies.token}` } : {};
  };

  const handleLogout = async () => {
    try {
      // Use the token for authentication
      const headers = setAuthToken();

      // Perform the POST request to logout from backend
      const response = await fetch('https://api.pitchpredictions.com/api/logout', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Destroy the cookies after successful logout
      nookies.destroy(null, 'token', { path: '/' });
      nookies.destroy(null, 'user', { path: '/' });

      // Redirect to main page
      window.location.replace('/auth/login');
    } catch (error) {
      alert('Logout failed');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
  
    try { 
      // Send the profile update request
      await api.post('/edit', {full_name,email,phone_number,country});
  
      // Display the success message and countdown
      const alertUserMsg = document.getElementById('alertUserMsg');
      const alertMessage2 = document.getElementById('alertMessage2');
  
      alertUserMsg.style.display = 'block'; 
      let countdown = 5;
  
      const interval = setInterval(() => {
        alertMessage2.innerText = `Profile Updated Successfully. Logging you out in ${countdown} seconds...`;
  
        if (countdown === 0) {
          clearInterval(interval); // Stop the interval
          handleLogout(); // Call the logout function
        }
  
        countdown -= 1; // Decrease the countdown
      }, 1000);
    } catch (error) {
      if (error.response?.data?.error) {
        document.getElementById('alertUserMsg').style.display = 'block';
        document.getElementById('alertMessage2').innerText = error.response.data.error;
      }
    } finally {
      setLoading(false); // Hide preloader
    }
  };
  
  return (
    <React.Fragment>
        {loading && (
            <AuthPreloader/>
        )}

      <main>
        <div className="container">
            <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card border-1 rounded-lg mt-5">
                <div className="card-header text-center">
                    <h2 className="font-weight-light">Edit Your Profile</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div
                        role="alert alert-danger"
                        id="alertUserMsg"
                        style={{ textAlign: 'center', display: 'none', color: 'red' }}
                        >
                        <p id="alertMessage2"></p>
                        </div>
                    </div>
                    <form onSubmit={handleUpdateProfile}>
                    <div className="form-floating mb-3">
                        <input
                        className={`form-control ${nameError ? 'is-invalid' : ''}`}
                        type="text"
                        name="full_name"
                        value={full_name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        aria-label="Full Name"
                        />
                        <label>Full Name</label>
                        {nameError && <div className="invalid-feedback" style={{ fontSize: '0.875rem', textAlign: "start" }}>{nameError}</div>}
                    </div>

                    <div className="form-floating mb-3">
                        <input
                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                        type="email"
                        name="email"
                        readOnly
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        aria-label="Email Address"
                        />
                        <label>Email Address</label>
                        {emailError && <div className="invalid-feedback" style={{ fontSize: '0.875rem', textAlign: "start" }}>{emailError}</div>}
                    </div>

                    <div className="form-floating mb-3">
                        <input
                        className={`form-control ${phoneNumberError ? 'is-invalid' : ''}`}
                        type="text"
                        name="phone_number"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        />
                        <label>Phone Number</label>
                        {phoneNumberError && <div className="invalid-feedback" style={{ fontSize: '0.875rem', textAlign: "start" }}>{phoneNumberError}</div>}
                    </div>

                    <div className="form-floating mb-3">
                        <select
                        className={`form-select ${countryError ? 'is-invalid' : ''}`}
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        aria-label="Select Country"
                        >
                        <option value="">Select your country</option>
                        {countries.map((c) => (
                            <option key={c} value={c}>
                            {c}
                            </option>
                        ))}
                        </select>
                        <label>Country</label>
                        {countryError && <div className="invalid-feedback" style={{ fontSize: '0.875rem', textAlign: "start" }}>{countryError}</div>}
                    </div>

                    <div className="d-grid mt-4">
                        <button className="btn btn-primary" type="submit"
                        style={{ backgroundColor: '#000', borderColor: '#000', color: 'white', fontWeight: 'bold' }}
                        >
                        Update Profile
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        <br /><br />
      </main>
    </React.Fragment>
  );
}

export default withAuth(EditProfile);
