'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LandingPage from './landing/page';

export default function HomePage() {
  // Simply render the landing page directly
  return <LandingPage />;
}