import Image from "next/image"
import { PrismaClient } from "@prisma/client"
import { NextApiRequest } from "next";

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

function addToCart(productId: string) {
  const options = {
    method: "POST",
    body: JSON.stringify({ "productId": productId }),
  };
  // Client side fetch, so don't use process.env
  void fetch(`${window.location.origin}/api/cart/add`, options);
}

export default function Home({ products }: Props) {
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
          <button onClick={() => addToCart(product.id)}>Add to cart</button>
        </div>
      ))}
    </main>
  )
}
