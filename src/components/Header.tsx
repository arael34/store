import Link from "next/link";

function Header({ count }: { count: number }) {
    return (
        <header className="w-full bg-slate-800">
            <div className="flex">
                <div className="w-1/2">
                    <h1 className="header__title">Store</h1>
                </div>
                <div className="text-right w-1/2">
                    <Link href="/cart">View cart</Link>
                    <p>{ count }</p>
                </div>
            </div>
        </header>
    );
}

export default Header;
