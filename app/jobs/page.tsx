import React, { Suspense } from 'react';
import JobsPageClient from './JobsPageClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPageClient />
    </Suspense>
  );
}
