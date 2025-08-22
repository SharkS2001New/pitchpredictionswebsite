import { useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import AuthPreloader from './includes/auth_preLoader';

const SocialLoginRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const { token, user, error } = router.query;

    if (error) {
      alert("Login failed: " + error);
      router.replace('/auth/login');
      return;
    }

    if (token && user) {
      nookies.set(null, 'token', token, { path: '/' });
      nookies.set(null, 'user', user, { path: '/' });

      router.replace('/auth/dashboard'); // Redirect to dashboard
    }
  }, [router]);

  return <AuthPreloader/>;
};

export default SocialLoginRedirect;
