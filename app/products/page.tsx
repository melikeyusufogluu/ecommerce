import { Suspense } from "react";
import ProductList from "../ProductList";

async function Products() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`,
  );
  const products = await response.json();

  const response2 = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/2/cart`,
    {
      cache: "no-cache",
    },
  );
  const cartProducts = await response2.json();

  return <ProductList products={products} initialCartProducts={cartProducts} />;
}

const ProductsPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <Suspense fallback={<p>Loading products...</p>}>
        <Products />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
