export const handleAuthorizationCodeFromURL = async (navigate) => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    if (code) {
      try {
        const data = await exchangeCodeForTokens(code);
        localStorage.setItem('accessToken', data.accessToken); // Store the token in local storage
  
        // Remove code from URL and navigate to home
        window.history.replaceState({}, document.title, '/');
        navigate('/');
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
      }
    }
  };
  
  export const verifyToken = async (token) => {
    if (token) {
      try {
        const data = await verifyToken(token);
        localStorage.setItem('accessToken', data.accessToken); // Store the new token
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
  };
  