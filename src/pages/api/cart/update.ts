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

    const { sessionId, productId, quantity } = req.body;

    if (!sessionId || !productId || !quantity) {
        res.status(400).end();
        return;
    }

    const prisma = new PrismaClient();

    await prisma.session.update({
        where: { id: sessionId },
        data: {
            cart: {
                push: {
                    productid: productId,
                    quantity: quantity,
                    
                }
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    });

    res.status(200).end();
}
