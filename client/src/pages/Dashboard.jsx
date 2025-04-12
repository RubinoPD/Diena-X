import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBackpacks } from "../services/backpacks";
import BackpackList from "../components/backpacks/BackpackList";
import BackpackForm from "../components/backpacks/BackpackForm";

const Dashboard = () => {
  const [backpacks, setBackpacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchBackpacks = async () => {
      try {
        const data = await getBackpacks();
        setBackpacks(data);
      } catch (error) {
        setError("Nepavyko gauti kuprinių duomenų.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackpacks();
  }, []);

  const handleBackpackAdded = (newBackpack) => {
    setBackpacks([...backpacks, newBackpack]);
    setShowForm(false);
  };

  const handleBackpackDeleted = (id) => {
    setBackpacks(backpacks.filter((backpack) => backpack._id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mano kuprinės</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
        >
          Susidėti naują kuprinę
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <BackpackForm
            onBackpackAdded={handleBackpackAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {backpacks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Jūs dar neturite kuprinių
          </h3>
          <p className="text-gray-500 mb-6">
            Pradėkite pridėdami savo pirmąją kuprinę.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
            >
              Pridėti kuprinę
            </button>
          )}
        </div>
      ) : (
        <BackpackList backpacks={backpacks} onDelete={handleBackpackDeleted} />
      )}
    </div>
  );
};

export default Dashboard;
