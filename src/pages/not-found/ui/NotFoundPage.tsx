import { Link } from 'react-router-dom';

import { StatusView } from '@/shared/ui';

export function NotFoundPage() {
  return (
    <StatusView
      icon="🧭"
      title="Page not found"
      description="The requested page could not be found."
      action={<Link to="/">← Back to Home</Link>}
    />
  );
}
