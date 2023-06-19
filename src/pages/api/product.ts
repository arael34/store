import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }
  const prisma = new PrismaClient()

  res.setHeader("Content-Type", "application/json");
  const products = await prisma.product.findMany();
  console.log(products);
  res.status(200).end();
}
