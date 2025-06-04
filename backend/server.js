const express = require('express');
const cors = require('cors'); 
const app = express();  
const path = require("path");      
const db = require('./db');  // Asegúrate que la conexión esté bien configurada

app.use(cors());              
app.use(express.json());  // Para recibir JSON en las peticiones
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM producto';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar los productos:', err);
      return res.status(500).json({ error: 'Error al consultar los productos' });
    }
    res.json(results);
  });
});

// Ruta para obtener categorías
app.get("/api/categorias", (req, res) => {
  const sql = "SELECT * FROM categoria";
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({ error: "Error al obtener categorías" });
    } else {
      res.json(results);
    }
  });
});

// Ruta para login
app.post('/api/login', (req, res) => {
  const { email_usuario, password } = req.body;

  console.log("Login request recibida:", { email_usuario, password });

  if (!email_usuario || !password) {
    console.log("Faltan datos");
    return res.status(400).json({ error: "Faltan email_usuario o password" });
  }

  const sqlUser = 'SELECT * FROM usuario WHERE email_usuario = ?';
  db.query(sqlUser, [email_usuario], (err, results) => {
    if (err) {
      console.error("Error BD:", err);
      return res.status(500).json({ error: "Error en base de datos" });
    }

    if (results.length === 0) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = results[0];
    console.log("Usuario encontrado:", usuario);

    if (usuario.password !== password) {
      console.log(`Clave incorrecta. Password recibido: '${password}', Password DB: '${usuario.password}'`);
      return res.status(401).json({ error: "Clave incorrecta" });
    }

    // Validar si es cliente o vendedor
    const sqlCliente = 'SELECT * FROM cliente WHERE id_cliente = ?';
    db.query(sqlCliente, [usuario.id_usuario], (err, resCli) => {
      if (err) {
        console.error("Error validando cliente:", err);
        return res.status(500).json({ error: "Error validando cliente" });
      }

      if (resCli.length > 0) {
        console.log("Es cliente");
        return res.json({ tipo: 'cliente', usuario });
      }

      const sqlVendedor = 'SELECT * FROM vendedor WHERE id_vendedor = ?';
      db.query(sqlVendedor, [usuario.id_usuario], (err, resVen) => {
        if (err) {
          console.error("Error validando vendedor:", err);
          return res.status(500).json({ error: "Error validando vendedor" });
        }

        if (resVen.length > 0) {
          console.log("Es vendedor");
          return res.json({ tipo: 'vendedor', usuario });
        }

        console.log("Tipo usuario no reconocido");
        return res.status(403).json({ error: "Tipo usuario no reconocido" });
      });
    });
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
