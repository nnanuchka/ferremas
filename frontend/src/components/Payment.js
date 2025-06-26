import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

export default function Payment() {
  const { state } = useLocation();
  const totalCLP = state?.total ?? 0;

  const [exchangeRate, setExchangeRate] = useState(null);
  const [currency, setCurrency] = useState('CLP');

  // API del Banco Central (mindicador.cl)
  useEffect(() => {
    fetch('https://mindicador.cl/api/dolar')
      .then(res => res.json())
      .then(data => {
        setExchangeRate(data.serie[0].valor);
      })
      .catch(err => console.error('Error al obtener tipo de cambio:', err));
  }, []);

  // Calcular total segun la moneda seleccionada
  const totalDisplay = currency === 'CLP'
    ? totalCLP.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
    : exchangeRate
      ? (totalCLP / exchangeRate).toFixed(2).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : 'Cargando...';

  // Webpay
  const handlePagar = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/pagos', {
        amount: totalCLP
      });
      // La API nos retorna una URL de pago
      window.location.href = response.data.paymentUrl;
    } catch (err) {
      console.error('Error al iniciar Webpay:', err);
      alert('No se pudo iniciar el pago. Intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-6">Proceso de Pago</h2>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Selecciona moneda:</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="CLP">CLP (Pesos chilenos)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
          </div>

          <p className="text-lg">
            <strong>Total a pagar:</strong> {totalDisplay}
          </p>

          <button
            onClick={handlePagar}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Pagar con Webpay
          </button>
        </div>
      </main>
    </div>
  );
}
