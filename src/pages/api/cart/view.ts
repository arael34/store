import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") {
        res.status(405).end();
        return;
    }

    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== "string") {
        res.status(200).json({ cart: [] });
        return;
    }

    const prisma = new PrismaClient();

    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        select: { cart: true },
    });

    res.status(200).json({ cart: session?.cart || []});
}
