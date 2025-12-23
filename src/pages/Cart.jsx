import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const cartId = localStorage.getItem("userId");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 

  const loadCart = async () => {
    if (!cartId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const data = await getCart(cartId);
      
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setItems([]);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [cartId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQtyChange = (id, value) => {
    const qty = Math.max(1, Number(value) || 1); 
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const saveChanges = async (item) => {
    setLoading(true);
    try {
      await updateCartItem({
        id: item.id,
        cartId: Number(cartId), 
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
      await loadCart(); 
    } catch (err) {
      console.error("Error actualizando carrito:", err);
      alert("No se pudo guardar la cantidad. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("¿Eliminar este producto del carrito?")) return;

    setLoading(true);
    try {
      await removeCartItem(id);
      await loadCart();
    } catch (err) {
      console.error("Error eliminando item:", err);
      alert("No se pudo eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const total = items
    .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
    .toFixed(2);

  if (!cartId) {
    navigate("/login");
    return null;
  }

  return (
    <div className="cart-container">
      <div className="cart-card">
        <h2>Carrito de Compras</h2>

        {loading && items.length === 0 ? (
          <p className="loading-text">Cargando carrito...</p>
        ) : items.length === 0 ? (
          <div className="empty-cart">
            <p>Carrito vacío</p>
            <button onClick={() => navigate("/home")} className="shop-btn">
              Ir a Comprar
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
  {item.imageUrl ? (
    <img src={item.imageUrl} alt={item.productName || 'Producto'} className="cart-product-image" />
  ) : (
    <div className="placeholder-image">Sin imagen</div>
  )}
  <strong>{item.productName || `Producto #${item.productId}`}</strong>
  <p className="unit-price">
    Precio unitario: ${item.unitPrice?.toFixed(2) || '0.00'}
  </p>
  <p className="subtotal">
    Subtotal: ${(item.quantity * (item.unitPrice || 0)).toFixed(2)}
  </p>
</div>

                  <div className="quantity-group">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQtyChange(item.id, e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => saveChanges(item)}
                      disabled={loading}
                      className="save-btn"
                    >
                      {loading ? "Guardando..." : "Guardar cantidad"}
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={loading}
                      className="remove-btn"
                    >
                      Eliminar producto
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h3>
                Total de la compra:{" "}
                <span className="total-amount">${total}</span>
              </h3>
            </div>

            <button
              onClick={() => navigate("/home")}
              className="back-home-btn"
            >
              Volver a Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}