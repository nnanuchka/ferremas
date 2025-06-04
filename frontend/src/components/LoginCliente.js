const handleLogin = async (e) => {
  e.preventDefault();

  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_usuario: correo, password: clave }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("usuario", JSON.stringify(data));
    if (data.tipo === "cliente") {
      navigate("/CategoryList");  // o la ruta que uses para productos cliente
    } else if (data.tipo === "vendedor") {
      navigate("/StockPanel"); // si tienes una ruta para vendedores
    } else {
      setError("Tipo de usuario desconocido");
    }
  } else {
    setError(data.error || "Error al iniciar sesión");
  }
};
