"use client";
import { Product } from "./product-data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductList = ({
  products,
  initialCartProducts,
}: {
  products: Product[];
  initialCartProducts: Product[];
}) => {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  const addToCart = async (productId: string) => {
    const response = await fetch(`http://localhost:3000/api/users/2/cart`, {
      method: "POST",
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

  const productIsInCart = (productId: string) => {
    return cartProducts.some((cp) => cp.id === productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
        >
          <div className="flex justify-center mb-4 h-48 relative">
            <Image
              src={"/" + product.imageUrl}
              alt="Product image"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>

          {productIsInCart(product.id) ? (
            <button
              className="cursor-pointer bg-blue-600 hover:bg-blue-800 text-white h-fit w-full py-2 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                removeFromCart(product.id);
              }}
            >
              Remove from Cart
            </button>
          ) : (
            <button
              className="cursor-pointer bg-blue-600 hover:bg-blue-800 text-white h-fit w-full py-2 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product.id);
              }}
            >
              Add to Cart
            </button>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
