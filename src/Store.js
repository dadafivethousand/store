import React, { useState } from "react";
import Item from "./Item"; // Make sure to import the Item component
import './Stylesheets/Store.css'
import catalog from './catalog.js'

 
export default function Store() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product, size, quantity) => {
    setCart([...cart, { ...product, size, quantity }]);
  };

  const handleBuyNow = async (priceId, size, quantity) => {
    // Call backend to create Stripe checkout session for a single item
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ price: priceId, quantity }],
        metadata: { size }, // Pass selected size
      }),
    });

    const session = await response.json();
    window.location.href = session.url; // Redirect to Stripe checkout
  };

  const handleCheckoutCart = async () => {
    // Map cart items to a format Stripe expects
    const items = cart.map((product) => ({
      price: product.priceId,
      quantity: product.quantity,
      metadata: { size: product.size },
    }));

    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const session = await response.json();
    window.location.href = session.url; // Redirect to Stripe checkout
  };

  return (
    <div className="store">
      <h1>Our Merchandise</h1>
      <div className="catalog">
        {catalog.map((item) => (
          <Item key={item.id} item={item} handleBuyNow={handleBuyNow} handleAddToCart={handleAddToCart} />
        ))}
      </div>
      {cart.length > 0 && (
        <div className="cart">
          <h2>Your Cart</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.title} - Size: {item.size} - Quantity: {item.quantity} - ${item.displayPrice * item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckoutCart}>Checkout Cart</button>
        </div>
      )}
    </div>
  );
}
