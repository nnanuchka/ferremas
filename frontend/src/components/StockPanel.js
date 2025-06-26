import React, { useState } from 'react';
import Header from './Header';
import axios from 'axios';

function StockPanel() {
  const [productos, setProductos] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    marca: '',
    precio: '',
    imagen: ''
  });

  const obtenerProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/productos");
      setProductos(response.data);
      setMostrar(true);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const confirmacion = window.confirm("¿Estás segura/o de eliminar este producto?");
      if (!confirmacion) return;

      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      setProductos(prev => prev.filter((p) => p.id_producto !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const modificarProducto = (producto) => {
    console.log("Modificar producto:", producto);
  };

  const handleAgregar = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/productos", {
        nombre_producto: nuevoProducto.nombre,
        marca_producto: nuevoProducto.marca,
        precio_producto: nuevoProducto.precio,
        imagen_producto: `/${nuevoProducto.imagen}`
      });

      setProductos([...productos, response.data]); // Agrega al final de la lista
      setNuevoProducto({ nombre: '', marca: '', precio: '', imagen: '' }); // Limpia formulario
      setFormVisible(false);
      alert("Producto agregado con éxito");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo agregar el producto");
    }
  };

  return (
    <div>
      <Header />

      <div className="p-8 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Panel del Vendedor</h2>

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={obtenerProductos}
        >
          Mostrar producto
        </button>

        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? 'Cerrar formulario' : 'Agregar producto'}
        </button>

        {/* Formulario para agregar producto */}
        {formVisible && (
          <form onSubmit={handleAgregar} className="mt-4 w-full max-w-md space-y-4 bg-white p-6 rounded shadow">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Marca"
              value={nuevoProducto.marca}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, marca: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Nombre de imagen (ej: Martillo.png)"
              value={nuevoProducto.imagen}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Guardar producto
            </button>
          </form>
        )}

        {mostrar && (
          <div className="mt-6 w-full max-w-4xl">
            <h3 className="text-lg font-semibold mb-4 text-left">Productos disponibles:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productos.map((producto) => (
                <li key={producto.id_producto} className="border p-4 rounded shadow">
                  <p><strong>Nombre:</strong> {producto.nombre_producto}</p>
                  <p><strong>Marca:</strong> {producto.marca_producto}</p>
                  <p><strong>Precio:</strong> ${producto.precio_producto}</p>
                  <img
                    src={`http://localhost:3000/images${producto.imagen_producto}`}
                    alt={producto.nombre_producto}
                    className="w-32 mt-2"
                  />

                  <div className="mt-4 flex gap-2">
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                      onClick={() => eliminarProducto(producto.id_producto)}
                    >
                      Eliminar
                    </button>

                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                      onClick={() => modificarProducto(producto)}
                    >
                      Modificar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockPanel;
