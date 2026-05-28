import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center p-8">
    <div className="text-center">
      <h1 className="text-9xl font-black gradient-text mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
        Page Not Found
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <Home className="w-5 h-5" /> Back to Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;