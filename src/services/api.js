const API_BASE_URL =
  import.meta.env.VITE_API_URL;


export async function login(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Correo o contraseña inválidos");
    }

    return await response.json();
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      throw new Error("No hay conexión con el servidor. Intenta más tarde.");
    }
    throw err;
  }
}

export async function register(user) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al registrarse");
  }

  return true;
}


export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/Products`);
  if (!response.ok) throw new Error("Error cargando productos");
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_BASE_URL}/Products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error creating product");
  }

  return true;
}

export async function updateProduct(product) {
  const response = await fetch(`${API_BASE_URL}/Products`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error updating product");
  }
  return true;
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/Products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error deleting product");
  return true;
}


export async function addToCart(userId, item) {
   const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error adding to cart");
  }
}

export async function getCart(cartId) {
  const response = await fetch(`${API_BASE_URL}/cart/${cartId}`);

  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      return [];
    }
    throw new Error(`Error ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

export async function updateCartItem(item) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error updating cart");
  }


  return true;
}

export async function removeCartItem(id) {
  const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error deleting item");
  return true;
}