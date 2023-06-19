import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        res.status(405).end();
        return;
    }

    const cookie = cookies().get("SESSION");
    const { productId } = req.body;

    const prisma = new PrismaClient();

    const session = await prisma.session.upsert({
        where: { id: cookie?.value || "" },
        update: {
            cart: {
                push: {
                    productid: productId,
                    quantity: 1,
                    
                }
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
        create: {
            cart: {
                set: [{
                    productid: productId,
                    quantity: 1,
                }],
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    });

    if (!cookie) cookies().set("SESSION", session.id, { secure: true });

    res.status(200).end();
}
