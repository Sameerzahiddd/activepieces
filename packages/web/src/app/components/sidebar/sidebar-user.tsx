import { Permission } from '@activepieces/shared';
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
  useUser,
} from '@clerk/clerk-react';
import { t } from 'i18next';
import { UserPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useEmbedding } from '@/components/providers/embed-provider';
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar-shadcn';
import { InviteUserDialog } from '@/features/members';
import { useAuthorization } from '@/hooks/authorization-hooks';
import { otom8ClerkAppearance } from '@/lib/otom8-clerk-appearance';
import { OTOM8_SITE_URL } from '@/lib/otom8-site-url';

// Replaces AP's native sidebar user dropdown with Clerk's <UserButton /> and
// exposes org switching via <OrganizationSwitcher />. When the active Clerk
// org changes, we bounce through /api/ap-sso on the otom8 site so AP
// re-authenticates under the new org's externalProjectId (see
// site/api/ap-sso/route.ts). OTOM8_SITE_URL comes from lib/deploy-env.ts
// (localhost → local site; prod build on app host → otom8.us).
export function SidebarUser() {
  const [inviteUserOpen, setInviteUserOpen] = useState(false);
  const { embedState } = useEmbedding();
  const { state } = useSidebar();
  const { user, isLoaded: userLoaded } = useUser();
  const { organization } = useOrganization();
  const { checkAccess } = useAuthorization();
  const canInviteUsers = checkAccess(Permission.WRITE_INVITATION);
  const isCollapsed = state === 'collapsed';

  // Re-run SSO whenever the active Clerk org changes, so AP's project context
  // moves with the user. We skip the first render (baseline value).
  const lastOrgRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const current = organization?.id ?? null;
    if (lastOrgRef.current === undefined) {
      lastOrgRef.current = current;
      return;
    }
    if (lastOrgRef.current !== current) {
      lastOrgRef.current = current;
      window.location.replace(`${OTOM8_SITE_URL}/api/ap-sso`);
    }
  }, [organization?.id]);

  if (!userLoaded || !user || embedState.isEmbedded) {
    return null;
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.primaryEmailAddress?.emailAddress ?? '';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="px-2 pt-1 pb-2">
          <OrganizationSwitcher
            appearance={otom8ClerkAppearance}
            hidePersonal={false}
            afterCreateOrganizationUrl={`${OTOM8_SITE_URL}/api/ap-sso`}
            afterLeaveOrganizationUrl={`${OTOM8_SITE_URL}/api/ap-sso`}
            afterSelectOrganizationUrl={`${OTOM8_SITE_URL}/api/ap-sso`}
            afterSelectPersonalUrl={`${OTOM8_SITE_URL}/api/ap-sso`}
          />
        </div>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <div
          className="flex items-center gap-2 px-2 py-2 w-full"
          data-testid="sidebar-user"
        >
          <UserButton
            appearance={{
              ...otom8ClerkAppearance,
              elements: {
                ...otom8ClerkAppearance.elements,
                avatarBox: { width: '24px', height: '24px' },
              },
            }}
            afterSignOutUrl={`${OTOM8_SITE_URL}/auth/signout`}
            userProfileMode="modal"
          >
            {canInviteUsers && (
              <UserButton.MenuItems>
                <UserButton.Action
                  label={t('Invite User')}
                  labelIcon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setInviteUserOpen(true)}
                />
              </UserButton.MenuItems>
            )}
          </UserButton>
          {!isCollapsed && (
            <span className="truncate text-sm text-foreground">
              {displayName}
            </span>
          )}
        </div>
      </SidebarMenuItem>

      <InviteUserDialog open={inviteUserOpen} setOpen={setInviteUserOpen} />
    </SidebarMenu>
  );
}
