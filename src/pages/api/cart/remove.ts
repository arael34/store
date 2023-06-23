import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        res.status(405).end();
        return;
    }

    const { sessionId, productId } = req.body;

    if (!sessionId || !productId) {
        res.status(400).end();
        return;
    }

    const prisma = new PrismaClient();

    await prisma.session.update({
        where: { id: sessionId },
        data: { cart: { deleteMany: { where: { productid: productId } } } },
    });

    res.status(200).end();
}
