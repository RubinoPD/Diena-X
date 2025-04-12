import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { deleteItem } from "../../services/items";

const ItemList = ({ items, onDelete, onEdit }) => {
  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      onDelete(id);
    } catch (error) {
      console.error("Klaida trinant daiktą:", error);
      alert("Nepavyko ištrinti daikto. Bandykite dar kartą.");
    }
  };

  // Funkcija galiojimo termino statuso nustatymui
  const getExpiryStatus = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Pasibaigęs", color: "text-red-700 bg-red-100" };
    } else if (diffDays <= 7) {
      return {
        text: "Baigiasi greitai",
        color: "text-orange-700 bg-orange-100",
      };
    } else if (diffDays <= 30) {
      return {
        text: "Baigiasi netrukus",
        color: "text-yellow-700 bg-yellow-100",
      };
    } else {
      return { text: "Galioja", color: "text-green-700 bg-green-100" };
    }
  };

  // Datos formatavimas
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("lt-LT", options);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Kuprinėje nėra daiktų
        </h3>
        <p className="text-gray-500">Pridėkite naujų daiktų į šią kuprinę.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {items.map((item) => {
          const status = getExpiryStatus(item.expiryDate);

          return (
            <li key={item._id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover mr-4"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-xs">
                        Nėra nuotraukos
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 mr-2">
                        Galioja iki:
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(item.expiryDate)}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-gray-500 hover:text-primary-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemList;
