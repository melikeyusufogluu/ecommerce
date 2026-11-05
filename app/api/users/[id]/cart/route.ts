import { products } from "@/app/product-data";
import { NextRequest } from "next/server";

type ShoppingCart = Record<string, string[]>;

const carts: ShoppingCart = {
  "1": ["123", "234"],
  "2": ["345", "456"],
  "3": ["234"],
};

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id: userId } = await params;
  const productIds = carts[userId];

  if (!productIds) {
    return new Response(JSON.stringify([]), { status: 404 });
  }

  const cartProducts = productIds.map((id) =>
    products.find((p) => p.id === id),
  );

  return new Response(JSON.stringify(cartProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

type CartBody = {
  productId: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id: userId } = await params;
  const body: CartBody = await request.json();
  const productId = String(body.productId);

  if (!products.some((p) => p.id === productId)) {
    return new Response("Product not found", { status: 404 });
  }

  carts[userId] = carts[userId] ? carts[userId].concat(productId) : [productId];
  const cartProducts = carts[userId].map((id) =>
    products.find((p) => p.id === id),
  );

  return new Response(JSON.stringify(cartProducts), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id: userId } = await params;
  const body: CartBody = await request.json();
  const productId = String(body.productId);

  if (!products.some((p) => p.id === productId)) {
    return new Response("Product not found", { status: 404 });
  }

  carts[userId] = carts[userId]
    ? carts[userId].filter((id) => id !== productId)
    : [];

  const cartProducts = carts[userId].map((id) =>
    products.find((p) => p.id === id),
  );

  return new Response(JSON.stringify(cartProducts), {
    status: 203,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
