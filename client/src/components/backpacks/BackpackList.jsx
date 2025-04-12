import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteBackpack } from "../../services/backpacks";

const BackpackList = ({ backpacks, onDelete }) => {
  const handleDelete = async (id) => {
    try {
      await deleteBackpack(id);
      onDelete(id);
    } catch (error) {
      console.error("Klaida trinant kuprinę:", error);
      alert("Nepavyko ištrinti kuprinės. Bandykite dar kartą.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {backpacks.map((backpack) => (
        <div
          key={backpack._id}
          className="bg-white overflow-hidden shadow rounded-lg flex flex-col"
        >
          <div className="px-4 py-5 sm:p-6 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {backpack.name}
              </h3>
              <button
                onClick={() => handleDelete(backpack._id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {backpack.description || "Nėra aprašymo"}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <Link
              to={`/backpacks/${backpack._id}`}
              className="text-primary-600 hover:text-primary-900 font-medium"
            >
              Peržiūrėti daiktus →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BackpackList;
