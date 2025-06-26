import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CategoryList from './components/CategoryList';
import StockPanel from './components/StockPanel';
import ProductList from './components/ProductList';
import Carrito from './components/Carrito';
import Payment from './components/Payment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoryList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categorias" element={<CategoryList />} />
        <Route path="/vendedor" element={<StockPanel />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/carrito" element={<Carrito />} />
                <Route path="/pago" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
