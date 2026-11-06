import { NextRequest } from "next/server";
import { connectToDb } from "../../db";

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { db } = await connectToDb();
  const { id: productId } = await params;

  const product = await db.collection("products").findOne({
    id: productId,
  });

  if (!product) {
    return new Response("Product not found", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
