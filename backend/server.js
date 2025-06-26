const {
  WebpayPlus,
  Options,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
  Environment
} = require('transbank-sdk');

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');  

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ————— RUTA PRODUCTOS ————— //
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM producto';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar productos:', err);
      return res.status(500).json({ error: 'Error al consultar productos' });
    }
    res.json(results);
  });
});

app.post('/api/productos', (req, res) => {
  const { nombre_producto, marca_producto, precio_producto, imagen_producto } = req.body;
  const sql = `
    INSERT INTO producto 
      (nombre_producto, marca_producto, precio_producto, imagen_producto) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [nombre_producto, marca_producto, precio_producto, imagen_producto], (err, result) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ error: 'Error al agregar producto' });
    }
    res.json({
      id_producto: result.insertId,
      nombre_producto,
      marca_producto,
      precio_producto,
      imagen_producto
    });
  });
});

app.delete('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM producto WHERE id_producto = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    res.json({ mensaje: 'Producto eliminado' });
  });
});

// ————— RUTAS DE CARRITO ————— //
app.get('/api/carrito/:idUsuario', (req, res) => {
  const idUsuario = req.params.idUsuario;
  const sql = `
    SELECT c.id_producto, p.nombre_producto, p.precio_producto, p.imagen_producto, c.cantidad
    FROM carrito c
    JOIN producto p ON c.id_producto = p.id_producto
    WHERE c.id_usuario = ?
  `;
  db.query(sql, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error al leer carrito:', err);
      return res.status(500).json({ error: 'Error al leer carrito' });
    }
    res.json(results);
  });
});

app.post('/api/carrito', (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;
  const upsert = `
    INSERT INTO carrito (id_usuario, id_producto, cantidad)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE cantidad = cantidad + ?
  `;
  db.query(upsert, [id_usuario, id_producto, cantidad, cantidad], (err) => {
    if (err) {
      console.error('Error al agregar al carrito:', err);
      return res.status(500).json({ error: 'Error al agregar al carrito' });
    }
    res.json({ mensaje: 'Producto agregado al carrito' });
  });
});

app.delete('/api/carrito/:idUsuario/:idProducto', (req, res) => {
  const { idUsuario, idProducto } = req.params;
  db.query(
    'DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?',
    [idUsuario, idProducto],
    (err) => {
      if (err) {
        console.error('Error al eliminar item del carrito:', err);
        return res.status(500).json({ error: 'Error al eliminar item del carrito' });
      }
      res.json({ mensaje: 'Item eliminado del carrito' });
    }
  );
});

// ————— RUTAS DE PAGO (Webpay Plus) ————— //
app.post('/api/pagos', async (req, res) => {
  const { amount } = req.body;
  const returnUrl = 'http://localhost:3001/pago';

  // Genera buyOrder y sessionId únicos
  const buyOrder = Math.floor(Math.random() * 1e6).toString();
  const sessionId = buyOrder;

  // Instancia Transaction para modo integración
  const tx = new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    )
  );

  try {
    const response = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    res.json({
      paymentUrl: `${response.url}?token_ws=${response.token}`,
      token: response.token
    });
  } catch (err) {
    console.error('Error iniciando Webpay:', err);
    res.status(500).json({ error: 'No se pudo iniciar el pago' });
  }
});


app.get('/api/categorias', (req, res) => {
  const sql = 'SELECT * FROM categoria';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener categorías:', error);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }
    res.json(results);
  });
});

app.post('/api/login', (req, res) => {
  const { email_usuario, password } = req.body;
  if (!email_usuario || !password) {
    return res.status(400).json({ error: 'Faltan email_usuario o password' });
  }
  db.query(
    'SELECT * FROM usuario WHERE email_usuario = ?',
    [email_usuario],
    (err, results) => {
      if (err) {
        console.error('Error BD:', err);
        return res.status(500).json({ error: 'Error en base de datos' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const usuario = results[0];
      if (usuario.password !== password) {
        return res.status(401).json({ error: 'Clave incorrecta' });
      }
      db.query(
        'SELECT * FROM cliente WHERE id_usuario = ?',
        [usuario.id_usuario],
        (err, resCli) => {
          if (err) {
            console.error('Error validando cliente:', err);
            return res.status(500).json({ error: 'Error validando cliente' });
          }
          if (resCli.length > 0) {
            return res.json({ tipo: 'cliente', usuario });
          }
          db.query(
            'SELECT * FROM vendedor WHERE id_usuario = ?',
            [usuario.id_usuario],
            (err, resVen) => {
              if (err) {
                console.error('Error validando vendedor:', err);
                return res.status(500).json({ error: 'Error validando vendedor' });
              }
              if (resVen.length > 0) {
                return res.json({ tipo: 'vendedor', usuario });
              }
              res.status(403).json({ error: 'Tipo de usuario no reconocido' });
            }
          );
        }
      );
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
