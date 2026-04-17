// Clerk appearance tokens for otom8 — structurally identical to
// otom8-site/site/src/lib/clerk-appearance.ts. AP can't import from the site
// package (separate build), so this file mirrors it. Update both in the same
// commit when appearance changes.

import type { Appearance } from '@clerk/types';

export const otom8ClerkAppearance: Appearance = {
  variables: {
    colorBackground: '#0A0A0A',
    colorText: '#F5F5F5',
    colorTextSecondary: '#A1A1AA',
    colorInputBackground: '#0A0A0A',
    colorInputText: '#F5F5F5',
    colorPrimary: '#10B981',
    colorDanger: '#EF4444',
    borderRadius: '0.625rem',
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    fontSize: '0.9375rem',
    spacingUnit: '1rem',
  },
  elements: {
    card: {
      boxShadow: 'none',
      border: '1px solid rgba(255,255,255,0.08)',
      backgroundColor: '#111111',
    },
    socialButtonsBlockButton: {
      borderColor: 'rgba(255,255,255,0.08)',
      backgroundColor: '#0A0A0A',
      color: '#F5F5F5',
      fontWeight: 500,
      transition: 'all 180ms ease',
    },
    socialButtonsBlockButtonText: { fontWeight: 500 },
    dividerLine: { backgroundColor: 'rgba(255,255,255,0.08)' },
    dividerText: {
      color: '#6B7280',
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    formFieldLabel: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: '#A1A1AA',
      textTransform: 'none',
      letterSpacing: 0,
    },
    formFieldInput: {
      backgroundColor: '#0A0A0A',
      borderColor: 'rgba(255,255,255,0.08)',
      color: '#F5F5F5',
    },
    formButtonPrimary: {
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: 0,
    },
    footerActionLink: {
      color: '#10B981',
      fontWeight: 500,
    },
    userButtonPopoverCard: {
      backgroundColor: '#111111',
      borderColor: 'rgba(255,255,255,0.08)',
    },
    userButtonPopoverActionButton: {
      color: '#F5F5F5',
    },
  },
};
