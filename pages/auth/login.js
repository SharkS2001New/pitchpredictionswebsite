import React, { useState, useEffect } from 'react';
import api from '../../components/auth/api';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthPreloader from './includes/auth_preLoader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false); // State for showing preloader
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get();
    if (cookies.token) {
      window.location.replace('/auth/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show preloader

    let hasError = false;

    if (!email) {
      setEmailError('Please enter your email.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      setLoading(false); // Stop preloader
      return;
    }

    try {
      const response = await api.post('/login', { email, password });

      if (response.data && response.data.token) {
        nookies.set(null, 'token', response.data.token, { path: '/'});
        
        nookies.set(null, 'user', JSON.stringify(response.data.user), { path: '/'});

        window.location.replace('/auth/dashboard');
      } 
    } catch (error) {
      document.getElementById('alertUserMsg').style.display = 'block';
      document.getElementById('alertMessage2').innerText = error.response?.data.message;
    } finally {
      setLoading(false); // Stop preloader after login attempt
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
                  <h2 className="text-center font-weight-light my-4">Login</h2>
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
                  <form onSubmit={handleLogin}>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="email"
                        id="email_address"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                      <label htmlFor="inputEmail">Email address</label>
                      {emailError && (
                        <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: 'start' }}>
                          {emailError}
                        </div>
                      )}
                    </div>
                    <br/>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                      <label htmlFor="inputPassword">Password</label>
                      {passwordError && (
                        <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: 'start' }}>
                          {passwordError}
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
                          LOGIN
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                    <Link
                      href="/auth/register"
                      style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      <i className="bi bi-person-fill-add"></i> Register
                    </Link>
                    <Link
                      href="/auth/forgot-password"
                      className="small"
                      style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      Forgot Password ?
                    </Link>
                  </div>
                  {/* <br/>
                  <SocialLogin/> */}
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

export default Login;
