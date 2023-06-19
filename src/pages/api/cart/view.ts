import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") {
        res.status(405).end();
        return;
    }

    const cookie = cookies().get("SESSION");
    if (!cookie) {
        res.status(200).end();
        return;
    }

    const prisma = new PrismaClient();

    const session = await prisma.session.findUnique({
        where: { id: cookie.value },
        select: { cart: true },
    });

    res.status(200).json(session?.cart);
}
