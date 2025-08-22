import { useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import AuthPreloader from './includes/auth_preLoader';

const SocialLoginRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      nookies.set(null, 'token', router.query.token, { path: '/' });
      nookies.set(null, 'user', router.query.user, { path: '/' });

      router.replace('/auth/dashboard'); // Redirect after storing
    }
  }, [router]);

  return <AuthPreloader/>;
};

export default SocialLoginRedirect;
