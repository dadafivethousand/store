import React, { useState } from "react";

export default function Item({ item, handleBuyNow, handleAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]); // Default to first size
  const [quantity, setQuantity] = useState(1); // Default quantity of 1

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="item">
        <div className="first">
      <img src={item.image} alt={item.title} />
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>${item.displayPrice}</p>
      </div>
      <div className="second">
      <div className="controls">
        <div className="size-select">
          <label htmlFor={`size-${item.id}`}>Size:</label>
          <select
            id={`size-${item.id}`}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {item.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="quantity-select">
          <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
          <div className="quantity-display">
            <button onClick={decrementQuantity}>-</button>
            <input
              type="number"
              id={`quantity-${item.id}`}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            />
            <button onClick={incrementQuantity}>+</button>
          </div>
        </div>
      </div>

      <button className="buy-now" onClick={() => handleBuyNow(item.priceId, selectedSize, quantity)}>
        Buy Now
      </button>
      <button className="add-to-cart" onClick={() => handleAddToCart(item, selectedSize, quantity)}>
        Add to Cart
      </button>
    </div>
    </div>
  );
}
