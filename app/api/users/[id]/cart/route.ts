import { connectToDb } from "@/app/api/db";
import { NextRequest } from "next/server";
import { Db } from "mongodb";

type Cart = {
  userId: string;
  cartIds: string[];
};

type Params = {
  id: string;
};

type CartBody = {
  productId: string;
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function getCartProducts(db: Db, cartIds: string[]) {
  return db
    .collection("products")
    .find({ id: { $in: cartIds } })
    .toArray();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { db } = await connectToDb();
  const { id: userId } = await params;

  const userCart = await db.collection<Cart>("carts").findOne({ userId });

  if (!userCart) {
    return json([], 404);
  }

  return json(await getCartProducts(db, userCart.cartIds), 200);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { db } = await connectToDb();
  const { id: userId } = await params;
  const body: CartBody = await request.json();
  const productId = String(body.productId);

  const product = await db.collection("products").findOne({ id: productId });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  // Add the product to the user's cart, creating the cart if it doesn't exist.
  const updatedCart = await db
    .collection<Cart>("carts")
    .findOneAndUpdate(
      { userId },
      { $addToSet: { cartIds: productId } },
      { upsert: true, returnDocument: "after" },
    );

  return json(await getCartProducts(db, updatedCart?.cartIds ?? []), 201);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { db } = await connectToDb();
  const { id: userId } = await params;
  const body: CartBody = await request.json();
  const productId = String(body.productId);

  const updatedCart = await db
    .collection<Cart>("carts")
    .findOneAndUpdate(
      { userId },
      { $pull: { cartIds: productId } },
      { returnDocument: "after" },
    );

  if (!updatedCart) {
    return new Response("Cart not found", { status: 404 });
  }

  return json(await getCartProducts(db, updatedCart.cartIds), 200);
}
