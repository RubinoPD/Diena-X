import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Puslapis nerastas
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Deja, puslapis, kurio ieškote, neegzistuoja arba buvo pašalintas.
      </p>
      <Link
        to="/"
        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Grįžti į pagrindinį puslapį
      </Link>
    </div>
  );
};

export default NotFound;
