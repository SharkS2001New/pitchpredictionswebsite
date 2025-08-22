import React from 'react';

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = `https://api.pitchpredictions.com/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-primary"
      style={{ width: '100%', fontWeight: 'bold' }}
    >
      Sign in with Google
    </button>
  );
};

export default SocialLogin;
