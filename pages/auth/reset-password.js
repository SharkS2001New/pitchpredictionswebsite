import { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const router = useRouter();
  const { token, email } = router.query; // Get token and email from URL query parameters
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = () => {
    let hasError = false;
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate password
    if (!password.trim()) {
      setPasswordError('Please enter your password.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    // Validate password confirmation
    if (!passwordConfirmation.trim()) {
      setConfirmPasswordError('Please enter your confirmation password.');
      hasError = true;
    } else if (password !== passwordConfirmation) {
      setConfirmPasswordError('Password and confirm password do not match.');
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

     // Validate form before sending request
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send reset password request to backend
      const response = await fetch('https://api.pitchpredictions.com/api/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password reset successful! You can now log in with your new password.');

        // Reset the password fields after successful reset
        setPassword('');
        setPasswordConfirmation('');

        // Optionally clear the success message after a short delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000); // Clear message after 5 seconds
      } else {
        setErrorMessage(data.message || 'An error occurred while resetting the password.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6 col-12">
            <div className="card border-1 rounded-lg mt-5" style={{paddingBottom: "0px!important"}}>
              <div className="card-header">
                <h2 className="text-center font-weight-light my-4">Reset Password</h2>
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
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                    />
                    <label htmlFor="password">Password</label>
                    {passwordError && (
                      <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: 'start' }}>
                        {passwordError}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="password"
                      id="passwordConfirmation"
                      name="passwordConfirmation"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Enter your Confirmation Password"
                    />
                    <label htmlFor="confirm_password">Confirm Password</label>
                    {confirmPasswordError && (
                      <div className="text-danger" style={{ fontSize: '0.875rem', textAlign: 'start' }}>
                        {confirmPasswordError}
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
                        disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
      <br />
      <br />
    </main>
  );
};

export default ResetPassword;
