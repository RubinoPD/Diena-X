import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBackpack, updateBackpack } from "../services/backpacks";
import { getItems } from "../services/items";
import ItemList from "../components/items/ItemList";
import ItemForm from "../components/items/ItemForm";

const BackpackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [backpack, setBackpack] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingBackpack, setEditingBackpack] = useState(false);
  const [backpackName, setBackpackName] = useState("");
  const [backpackDescription, setBackpackDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backpackData = await getBackpack(id);
        setBackpack(backpackData);
        setBackpackName(backpackData.name);
        setBackpackDescription(backpackData.description || "");

        const itemsData = await getItems(id);
        setItems(itemsData);
      } catch (error) {
        setError("Nepavyko gauti kuprinės duomenų.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleItemAdded = (newItem) => {
    setItems([...items, newItem]);
    setShowForm(false);
  };

  const handleItemUpdated = (updatedItem) => {
    setItems(
      items.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
    setEditingItem(null);
    setShowForm(false);
  };

  const handleItemDeleted = (id) => {
    setItems(items.filter((item) => item._id !== id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleUpdateBackpack = async () => {
    try {
      const updatedBackpack = await updateBackpack(id, {
        name: backpackName,
        description: backpackDescription,
      });

      setBackpack(updatedBackpack);
      setEditingBackpack(false);
    } catch (error) {
      setError("Nepavyko atnaujinti kuprinės.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!backpack) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Kuprinė nerasta
        </h3>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Grįžti į valdymo pultą
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {editingBackpack ? (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Redaguoti kuprinę
          </h2>

          <div className="mb-4">
            <label
              htmlFor="backpackName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pavadinimas
            </label>
            <input
              type="text"
              id="backpackName"
              value={backpackName}
              onChange={(e) => setBackpackName(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="backpackDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aprašymas (neprivaloma)
            </label>
            <textarea
              id="backpackDescription"
              value={backpackDescription}
              onChange={(e) => setBackpackDescription(e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setEditingBackpack(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Atšaukti
            </button>
            <button
              onClick={handleUpdateBackpack}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Išsaugoti
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {backpack.name}
            </h1>
            {backpack.description && (
              <p className="mt-2 text-gray-600">{backpack.description}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setEditingBackpack(true)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
            >
              Redaguoti kuprinę
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
            >
              Grįžti atgal
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Kuprinės daiktai
        </h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
        >
          Pridėti daiktą
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ItemForm
            backpackId={id}
            item={editingItem}
            onItemAdded={handleItemAdded}
            onItemUpdated={handleItemUpdated}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <ItemList
        items={items}
        onDelete={handleItemDeleted}
        onEdit={handleEditItem}
      />
    </div>
  );
};

export default BackpackPage;
