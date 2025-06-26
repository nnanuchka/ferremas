import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

export default function Carrito() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Carga los items del carrito al montar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (stored.usuario) {
      const idUsuario = stored.usuario.id_usuario;
      axios
        .get(`http://localhost:3000/api/carrito/${idUsuario}`)
        .then(res => setItems(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  // Incrementa la cantidad en 1
  const incrementar = async (producto) => {
    const stored = JSON.parse(localStorage.getItem('usuario'));
    const idUsuario = stored.usuario.id_usuario;
    try {
      await axios.post("http://localhost:3000/api/carrito", {
        id_usuario: idUsuario,
        id_producto: producto.id_producto,
        cantidad: 1
      });
      setItems(prev =>
        prev.map(i =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } catch (err) {
      console.error("Error incrementando cantidad:", err);
    }
  };

  // Decrementa la cantidad en 1 (o elimina si queda en 0)
  const decrementar = async (producto) => {
    const stored = JSON.parse(localStorage.getItem('usuario'));
    const idUsuario = stored.usuario.id_usuario;
    if (producto.cantidad > 1) {
      try {
        await axios.post("http://localhost:3000/api/carrito", {
          id_usuario: idUsuario,
          id_producto: producto.id_producto,
          cantidad: -1
        });
        setItems(prev =>
          prev.map(i =>
            i.id_producto === producto.id_producto
              ? { ...i, cantidad: i.cantidad - 1 }
              : i
          )
        );
      } catch (err) {
        console.error("Error decrementando cantidad:", err);
      }
    } else {
      eliminar(producto.id_producto);
    }
  };

  // Elimina completamente el producto del carrito
  const eliminar = async (id_producto) => {
    const stored = JSON.parse(localStorage.getItem('usuario'));
    const idUsuario = stored.usuario.id_usuario;
    try {
      await axios.delete(`http://localhost:3000/api/carrito/${idUsuario}/${id_producto}`);
      setItems(prev => prev.filter(i => i.id_producto !== id_producto));
    } catch (err) {
      console.error("Error al eliminar item del carrito:", err);
    }
  };

  // Calcula el total del carrito
  const total = items.reduce(
    (sum, item) => sum + item.precio_producto * item.cantidad,
    0
  );

  // Botón "Pagar": redirige a la página de pago con el total
  const handlePagar = () => {
    navigate('/pago', { state: { total } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-6">Tu Carrito</h2>
        {items.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map(item => (
                <li
                  key={item.id_producto}
                  className="flex items-center gap-4 bg-white p-4 rounded shadow"
                >
                  <img
                    src={`http://localhost:3000/images${item.imagen_producto}`}
                    alt={item.nombre_producto}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.nombre_producto}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => decrementar(item)}
                        className="bg-gray-300 text-gray-800 px-2 py-1 rounded"
                      >-</button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => incrementar(item)}
                        className="bg-gray-300 text-gray-800 px-2 py-1 rounded"
                      >+</button>
                    </div>
                    <p className="mt-1">Precio unitario: ${item.precio_producto}</p>
                  </div>
                  <button
                    onClick={() => eliminar(item.id_producto)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            {/* Total y botón Pagar */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-xl font-bold">Total: ${total}</p>
              <button
                onClick={handlePagar}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Pagar
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
