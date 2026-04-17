import { flagsHooks } from '@/hooks/flags-hooks';

const FullLogo = () => {
  const branding = flagsHooks.useWebsiteBranding();

  return (
    <div
      className="flex h-[60px] items-center justify-center"
      style={{
        fontFamily: 'Georgia, serif',
        fontWeight: 300,
        fontSize: '1.75rem',
        letterSpacing: '0.05em',
        color: 'var(--foreground)',
      }}
    >
      {branding.websiteName}
    </div>
  );
};
FullLogo.displayName = 'FullLogo';
export { FullLogo };
