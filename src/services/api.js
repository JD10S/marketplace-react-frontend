const API_BASE_URL = "http://localhost:5140/api";




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
      throw new Error("No hay conexión con el servidor. Revisa tu internet o intenta más tarde.");
    }
    throw err;
  }
}

export async function register(user) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return true; 
}



export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    throw new Error("Error creating product");
  }

  return true; 
}

export async function updateProduct(product) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error("Error updating product");
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error deleting product");
  return true;
}


export async function addToCart(item) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Error adding to cart");
  }

  return true;
}

export async function getCart(cartId) {
  const response = await fetch(`${API_BASE_URL}/cart/${cartId}`);
  return response.json();
}

export async function updateCartItem(item) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) throw new Error("Error updating cart");
  return response.json();
}

export async function removeCartItem(id) {
  const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error deleting item");
  return true;
}
