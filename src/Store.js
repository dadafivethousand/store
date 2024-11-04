import React, { useState } from "react";
import Item from "./Item"; // Make sure to import the Item component
import './Stylesheets/Store.css'

const catalog = [
  {
    id: "1",
    title: "BJJ T-Shirt",
    description: "Comfortable and durable BJJ-themed t-shirt.",
    image: "/images/tshirt.jpg",
    priceId: "price_1HX4m2Jd22...", // Stripe price ID
    displayPrice: 25.00,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    title: "BJJ Hoodie",
    description: "Stay warm with this cozy BJJ hoodie.",
    image: "/images/hoodie.jpg",
    priceId: "price_1HX4n3Jd23...",
    displayPrice: 40.00,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "3",
    title: "BJJ Cap",
    description: "Cap with our BJJ academy logo.",
    image: "/images/cap.jpg",
    priceId: "price_1HX4o5Jd24...",
    displayPrice: 20.00,
    sizes: ["One Size"],
  },
];

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
