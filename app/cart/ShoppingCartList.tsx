"use client";

import { useState } from "react";
import { Product } from "../product-data";
import Link from "next/link";

const ShoppingCartList = ({
  initialCartProducts,
}: {
  initialCartProducts: Product[];
}) => {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  const removeFromCart = async (productId: string) => {
    const response = await fetch(`http://localhost:3000/api/users/2/cart`, {
      method: "DELETE",
      body: JSON.stringify({
        productId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const updatedCartProducts = await response.json();
    setCartProducts(updatedCartProducts);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <ul className="space-y-4">
        {cartProducts.map((product) => (
          <li
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
          >
            <div className="flex justify-between items-center">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </Link>
              <button
                className="cursor-pointer bg-blue-600 hover:bg-blue-800 text-white h-fit w-fit p-2 my-auto rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromCart(product.id);
                }}
              >
                Remove from Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCartList;
