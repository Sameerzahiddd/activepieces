import { useEffect } from 'react';

import { OTOM8_SITE_URL } from '@/lib/otom8-site-url';

// Shared stub for AP's legacy native auth routes (forget-password,
// reset-password, verify-email, invitation). Clerk owns account lifecycle,
// so these routes always bounce to the otom8 site's /login.
export const RedirectToLogin: React.FC = () => {
  useEffect(() => {
    window.location.replace(`${OTOM8_SITE_URL}/login`);
  }, []);
  return null;
};

RedirectToLogin.displayName = 'RedirectToLogin';
