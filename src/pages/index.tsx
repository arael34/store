import { NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client"
import Image from "next/image"
import { useCookies } from "react-cookie";
import { addToCart } from "@/util/api";

export async function getStaticProps(req: NextApiRequest) {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany();

  return {
    props: {
      products,
    },
    revalidate: 300,
  }
}

type Props = {
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
  }[];
};

export default function Home({ products }: Props) {
  const [cookies, setCookie] = useCookies(["cart"]);

  return (
    <main>
      {products.map((product) => (
        <div key={product.id}>
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
          />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <button onClick={() => addToCart(product.id, cookies, setCookie)}>
            Add to cart
          </button>
        </div>
      ))}
    </main>
  )
}
