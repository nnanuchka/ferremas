const db = require('../db');

const obtenerProductos = (req, res) => {
  db.query('SELECT * FROM producto', (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error al consultar los productos' });
    }
    res.json(results);
  });
};

module.exports = { obtenerProductos };
