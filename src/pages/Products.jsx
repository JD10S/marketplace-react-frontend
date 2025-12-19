import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: ""
  });

  const loadProducts = () => {
    getProducts().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name.trim()) {
    alert("El nombre es obligatorio");
    return;
  }

  if (!form.price || form.price <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  const productToSend = {
    Name: form.name.trim(),
    Description: form.description.trim(),
    Price: parseFloat(form.price),  
    Stock: parseInt(form.stock, 10) || 0,
    ImageUrl: form.imageUrl.trim() || null
  };

  console.log("Producto enviado al backend:", productToSend);

  try {
    const action = editingId
      ? updateProduct({ id: editingId, ...productToSend })
      : createProduct(productToSend);

    await action;
    await loadProducts();
    resetForm();
    alert(editingId ? "Producto actualizado" : "Producto creado con éxito");
  } catch (err) {
    console.error("Error al guardar producto:", err);
    alert("Error al guardar el producto. Revisa los datos.");
  }
};

  const edit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const remove = (id) => {
    if (confirm("¿Eliminar producto?")) {
      deleteProduct(id).then(loadProducts);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: ""
    });
    setEditingId(null);
  };

  return (
    <div className="products-container">
      <div className="products-card">
        <h2>Gestión de Productos</h2>
        <p className="subtitle">
          Crear, editar y eliminar productos
        </p>

 
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="Descripción"
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="input-row">
            <input
              className="half"
              type="number"
              placeholder="Precio"
              value={form.price}
              onChange={e =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />

            <input
              className="half"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={e =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </div>

          <div className="input-group">
            <input
              placeholder="URL Imagen"
              value={form.imageUrl}
              onChange={e =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />
          </div>

          <div className="form-actions">
            <button className="submit-btn" type="submit">
              {editingId ? "Actualizar" : "Guardar"}
            </button>

            {editingId && (
              <button
                className="cancel-btn"
                type="button"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="divider" />

        
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="product-image"
                />
              ) : (
                <div className="placeholder-image">
                  Sin imagen
                </div>
              )}

              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="description">{p.description}</p>
                <div className="price">${p.price}</div>
              </div>

              <div className="product-actions">
                <button
                  className="edit-btn"
                  onClick={() => edit(p)}
                >
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => remove(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/home")}
        >
          Volver a Home
        </button>
      </div>
    </div>
  );
}
