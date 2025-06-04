import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // Verifica si hay un usuario autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Limpia los datos
    navigate("/"); // Redirige al inicio
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        FERREMAS
      </h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
        >
          Inicio
        </button>
        <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100">
          Carrito
        </button>

        {!usuario ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            Iniciar sesión
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
}
