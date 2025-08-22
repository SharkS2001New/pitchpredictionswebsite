import React, { useState, useEffect } from 'react';
import api from '../../components/auth/api';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import AuthPreloader from './includes/auth_preLoader';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Email validation regex
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let hasError = false;
    setEmailError(''); // Reset email error on every form submission

    // Check if email is empty
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      hasError = true;
    } 
    // Check if the email format is valid
    else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    return !hasError;
  };

  useEffect(() => {
    const cookies = nookies.get();
    if (cookies.token) {
      router.replace('/auth/login'); // Redirect if the user is already logged in
    }
  }, [router]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Show preloader
    setEmailError(''); // Reset email error
    setErrorMessage(''); // Reset error message
    setSuccessMessage(''); // Reset success message

    // Validate the form before submitting
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // API call for forgot password
      const response = await api.post('/forgot_password', { email });

      setSuccessMessage(response.data.message || 'Password reset link sent to your email.');
      
      // Reset the email input field after successful submission
      setEmail('');

      // Optionally clear the success message after a short delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // Clear message after 5 seconds

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {loading && <AuthPreloader />}

      <main style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-12">
              <div className="card border-1 rounded-lg mt-5" style={{paddingBottom: "0px!important"}}>
                <div className="card-header">
                  <h2 className="text-center font-weight-light my-4">Forgot Password</h2>
                </div>
                <div className="card-body">
                  <div className="row">
                    {successMessage && (
                      <div
                        role="alert"
                        className="alert alert-success"
                        style={{ textAlign: 'center', color: 'green' }}
                      >
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div
                        role="alert"
                        className="alert alert-danger"
                        style={{ textAlign: 'center', color: 'red' }}
                      >
                        {errorMessage}
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleForgotPassword}>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="email"
                        id="email_address"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                      <label htmlFor="email_address">Email address</label>
                      {emailError && (
                        <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: 'start' }}>
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 mb-0">
                      <div className="d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          style={{
                            backgroundColor: '#000',
                            borderColor: '#000',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="py-2"></div>
              </div>
              <div className="py-4"></div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </main>
      <br />
      <br />
    </React.Fragment>
  );
}

export default ForgotPassword;
