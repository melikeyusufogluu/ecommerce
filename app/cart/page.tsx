import { Suspense } from "react";
import ShoppingCartList from "./ShoppingCartList";

async function CartContents() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/2/cart`,
    {
      cache: "no-cache",
    },
  );
  const cartProducts = await response.json();

  return <ShoppingCartList initialCartProducts={cartProducts} />;
}

export default function CartPage() {
  return (
    <Suspense fallback={<p className="container mx-auto p-8">Loading cart...</p>}>
      <CartContents />
    </Suspense>
  );
}
