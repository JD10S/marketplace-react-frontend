import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css"; 

export default function Cart() {
  const cartId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    getCart(cartId).then(setItems);
  };

  useEffect(() => {
    if (cartId) loadCart();
  }, [cartId]);

  const handleQtyChange = (id, value) => {
    if (value <= 0) return;

    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const saveChanges = (item) => {
    updateCartItem({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }).then(loadCart);
  };

  const removeItem = (id) => {
    removeCartItem(id).then(loadCart);
  };

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0
  ).toFixed(2);

  if (!cartId) {
    navigate("/login");
    return null;
  }

  return (
    <div className="cart-container">
      <div className="cart-card">
        <h2>Carrito de Compras</h2>

        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Carrito vacío</p>
            <button onClick={() => navigate("/home")} className="shop-btn">
              Ir a Comprar
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <strong>Producto #{item.productId}</strong>
                    <p className="unit-price">Precio unitario: ${item.unitPrice.toFixed(2)}</p>
                    <p className="subtotal">Subtotal: ${(item.quantity * item.unitPrice).toFixed(2)}</p>
                  </div>

                  <div className="quantity-group">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e =>
                        handleQtyChange(item.id, Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="item-actions">
                    <button onClick={() => saveChanges(item)} className="save-btn">
                      Guardar cantidad
                    </button>
                    <button onClick={() => removeItem(item.id)} className="remove-btn">
                      Eliminar producto
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h3>Total de la compra: <span className="total-amount">${total}</span></h3>
            </div>

            <button onClick={() => navigate("/home")} className="back-home-btn">
              Volver a Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}