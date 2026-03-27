import { useEffect } from 'react';

const SignUpPage: React.FC = () => {
  useEffect(() => {
    window.location.replace('https://otom8.us/login');
  }, []);

  return null;
};

SignUpPage.displayName = 'SignUpPage';

export { SignUpPage };
