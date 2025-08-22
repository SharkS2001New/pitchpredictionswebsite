import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AuthPreloader from './includes/auth_preLoader';

export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
      const cookies = parseCookies();
      if (cookies.token) {
        setIsAuthenticated(true);
      } else {
        // router.push('/auth/login'); // Redirect to login if not authenticated
        window.location.replace('/auth/login')
      }
      setIsLoading(false); 
    }, [router]);

    if (isLoading) {
      // Display a preloader or nothing while loading
      return <div className="row justify-content-center" style={{height: "500px"}}>
                <AuthPreloader /> 
              </div>;
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
}
 