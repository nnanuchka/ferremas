// src/components/CategoryList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; // Asegúrate de que la ruta sea correcta

export default function CategoryList() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Categorías de Productos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categorias.map((categoria) => (
            <div
              key={categoria.id_categoria}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={`http://localhost:3000/images/${categoria.imagen_categoria}`}
                alt={categoria.nombre_categoria}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-3">
                  {categoria.nombre_categoria}
                </h3>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                  onClick={() => navigate("/ProductList")}
                >
                  Ver Productos
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
