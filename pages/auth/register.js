import React, { useState, useEffect } from 'react';
import api from '../../components/auth/api';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthPreloader from './includes/auth_preLoader';
import countries from '../../components/auth/countries';

export default function Register() {
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [countryError, setCountryError] = useState('');

  const [loading, setLoading] = useState(false); // State for preloader
  const router = useRouter();

  const validateForm = () => {
    let hasError = false;
    setNameError('');
    setEmailError('');
    setPhoneNumberError('');
    setPasswordError('');
    setConfirmPasswordError('');
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

    const validatePassword = (password) => {
      if (!password.trim()) {
        return 'Please enter your password';
      }
      if (password.length < 8) {
        return 'Password length should be atleast 8 characters';
      }
      return null; // No error
    };

    const confirmValidatePassword = (password, confirmPassword) => {
      if (!confirmPassword.trim()) {
        return 'Please enter your confirmation password';
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError('Password and Confirm Password do not match.');
        hasError = true;
      }

      return null; // No error
    };

    const passwordErrorMessage = validatePassword(password);
    if (passwordErrorMessage) {
      setPasswordError(passwordErrorMessage);
      hasError = true;
    }

    const confirmPasswordErrorMessage = confirmValidatePassword(password, password_confirmation);
    if (confirmPasswordErrorMessage) {
      setConfirmPasswordError(confirmPasswordErrorMessage);
      hasError = true;
    }

    if (!country) {
      setCountryError('Please select a country.');
      hasError = true;
    }

    return !hasError;
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const cookies = nookies.get();
    if (cookies.token) {
      window.location.replace('/auth/dashboard');
    }
  }, [router]);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Show preloader

    try {
      await api.post('/register', { full_name, email, phone_number, country, password, password_confirmation });
      
       // Display the success message and countdown
       const alertUserMsg = document.getElementById('alertUserMsg');
       const alertMessage2 = document.getElementById('alertMessage2');
   
       alertUserMsg.style.display = 'block'; 
       let countdown = 3;
   
       const interval = setInterval(() => {
         alertMessage2.innerText = `Registration was Successfully. Redirecting in ${countdown} seconds...`;
   
         if (countdown === 0) {
           clearInterval(interval); // Stop the interval
          
           window.location.replace('/auth/login');
          }
   
         countdown -= 1; // Decrease the countdown
       }, 1000);

    } catch (error) {
      // Check for specific validation errors
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
  
      <main style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-12">
              <div className="card border-1 rounded-lg mt-5" style={{paddingBottom: "0px!important"}}>
                <div className="card-header">
                  <h2 className="text-center font-weight-light my-4">Register</h2>
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
                  <form onSubmit={handleRegister}>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="text"
                        value={full_name}
                        name="full_name"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                      <label>Full Name</label>
                      {nameError && (
                        <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: 'start' }}>
                          {nameError}
                        </div>
                      )}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                      <label>Email Address</label>
                      {emailError && <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: "start" }}>{emailError}</div>}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="number"
                        value={phone_number}
                        name="phone_number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                      <label>Phone Number</label>
                      {phoneNumberError && <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: "start" }}>{phoneNumberError}</div>}
                    </div>
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        value={country}
                        name="country"
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select your country</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <label>Country</label>
                      {countryError && <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: "start" }}>{countryError}</div>}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      <label>Password</label>
                      {passwordError && <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: "start" }}>{passwordError}</div>}
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            className="form-control"
                            type="password"
                            id="confirm_password"
                            name="password_confirmation"
                            value={password_confirmation}
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label htmlFor="confirm_password">Confirm Password</label>
                        {confirmPasswordError && <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: "start" }}>{confirmPasswordError}</div>}
                    </div>       
                    <div className="d-grid mt-4">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        style={{ backgroundColor: '#000', borderColor: '#000', color: 'white', fontWeight: 'bold' }}
                      >
                        Register
                      </button>
                    </div>
                  </form>
                  <div className="d-flex align-items-center justify-content-between mt-4">
                    <div className="col-12 text-center">
                      <p className="mb-0">
                        Already have an account?
                        <Link
                          href="/auth/login"
                          style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}
                        >
                          &nbsp;Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </main>
      <br/><br/>
    </React.Fragment>
  );
}
