// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import Header from "./Header"; // Asegúrate de que la ruta sea correcta

export default function ProductList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.text())
      .then((data) => {
        setProductos(JSON.parse(data));
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Lista de Productos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
            <div
              key={producto.id_producto}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={`http://localhost:3000/images/${producto.imagen_producto}`}
                alt={producto.nombre_producto}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-1">
                  {producto.nombre_producto}
                </h3>
                <p className="text-gray-600">${producto.precio_producto}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {producto.marca_producto}
                </p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                  onClick={() =>
                    console.log(`Agregar al carrito: ${producto.nombre_producto}`)
                  }
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
