import React from 'react';

const GoogleSignInButton: React.FC = () => {
  const handleSignIn = async () => {
    const response = await fetch('/api/google/auth-url');
    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <button onClick={handleSignIn}>
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;