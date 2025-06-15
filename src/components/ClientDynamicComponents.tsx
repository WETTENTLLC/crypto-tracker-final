'use client';

import dynamic from 'next/dynamic';

const ExitIntentProvider = dynamic(
  () => import('../components/ExitIntentProvider'),
  { ssr: false }
);

const VisitorCounter = dynamic(
  () => import('../components/VisitorCounter'),
  { ssr: false }
);

const EmailSequenceAutomation = dynamic(
  () => import('../components/EmailSequenceAutomation'),
  { ssr: false }
);

const AffiliateMarketingTracker = dynamic(
  () => import('../components/AffiliateMarketingTracker'),
  { ssr: false }
);

const ConversionTracker = dynamic(
  () => import('../components/ConversionTracker'),
  { ssr: false }
);

interface ClientDynamicComponentsProps {
  children: React.ReactNode;
}

export default function ClientDynamicComponents({ children }: ClientDynamicComponentsProps) {
  return (
    <>
      <ExitIntentProvider>
        <VisitorCounter />
        <EmailSequenceAutomation userStatus="visitor" />
        <AffiliateMarketingTracker />
        <ConversionTracker />
        {children}
      </ExitIntentProvider>
    </>
  );
}
