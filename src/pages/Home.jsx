import { getProducts, addToCart } from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css"; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  
  useEffect(() => {
    if (userId) {
      getProducts()
        .then(setProducts)
        .catch(() => alert("Error cargando productos"));
    }
  }, [userId]);

  const handleQtyChange = (productId, value) => {
    const numValue = value === "" ? "" : Math.max(1, Number(value));
    setQuantities(prev => ({
      ...prev,
      [productId]: numValue
    }));
  };

 const handleAddToCart = async (product) => {
  const qty = Number(quantities[product.id] || 1);

  if (qty < 1 || qty > product.stock) {
    alert("Cantidad inválida");
    return;
  }

  setLoading(true);
  try {
    await addToCart(userId, {
      productId: product.id,
      quantity: qty,
      unitPrice: product.price 
    });

    alert(`¡Se añadieron ${qty} "${product.name}" al carrito!`);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  } catch (err) {
    console.error("Error:", err);
    alert(err.message || "Error al añadir al carrito");
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="header">
          <h2>Marketplace</h2>
          <p className="subtitle">Bienvenido, explora nuestros productos</p>
        </div>

        <div className="navigation">
          <button onClick={() => navigate("/cart")} className="nav-btn">
            🛒 Ver Carrito
          </button>
          <button onClick={() => navigate("/products")} className="nav-btn">
            ⚙️ Gestionar Productos
          </button>
          <button onClick={logout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>

        {products.length === 0 ? (
          <p className="empty-message">No hay productos disponibles en este momento.</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                ) : (
                  <div className="placeholder-image">Sin imagen</div>
                )}

                <div className="product-info">
                  <h3>{product.name}</h3>
                  {product.description && (
                    <p className="description">{product.description}</p>
                  )}
                  <p className="price">${product.price.toFixed(2)}</p>
                  <p className="stock">Disponibles: {product.stock}</p>
                </div>

                <div className="product-actions">
                  <div className="quantity-selector">
                    <button
                      onClick={() => handleQtyChange(product.id, (quantities[product.id] || 1) - 1)}
                      disabled={(quantities[product.id] || 1) <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => handleQtyChange(product.id, (quantities[product.id] || 1) + 1)}
                      disabled={(quantities[product.id] || 1) >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loading || product.stock <= 0}
                    className="add-to-cart-btn"
                  >
                    {product.stock <= 0 ? "Agotado" : "Añadir al carrito"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}