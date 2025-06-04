import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';  // Importa el componente Login
import ProductList from './components/ProductList'; // Página de productos para el cliente
import CategoryList from './components/CategoryList'; // Página de categorías para el cliente
import StockPanel from "./components/StockPanel"; // ajusta la ruta si es distinta

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de categorías (principal) para el cliente */}
        <Route path="/" element={<CategoryList />} />

        {/* Página de productos solo accesible para clientes */}
        <Route path="/ProductList" element={<ProductList />} />

        {/* Página de productos solo accesible para clientes */}
        <Route path="/CategoryList" element={<ProductList />} />

        {/* Página de productos solo accesible para clientes */}
        <Route path="/StockPanel" element={<StockPanel />} />

        {/* Página de inicio de sesión */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
