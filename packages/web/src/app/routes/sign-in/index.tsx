import { useEffect } from 'react';

const SignInPage: React.FC = () => {
  useEffect(() => {
    window.location.replace('https://otom8.us/auth/signout');
  }, []);

  return null;
};

SignInPage.displayName = 'SignInPage';

export { SignInPage };
