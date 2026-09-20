import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="font-display text-6xl font-bold text-violet-500">404</span>
      <h1 className="mt-3 font-display text-2xl font-semibold text-mist-50">Page not found</h1>
      <p className="mt-2 text-mist-400">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
