import Link from 'next/link';

function Header() {
  return (
    <header className="h-fit w-full border-b border-b-[#ffffff44] bg-[#00000033] backdrop-blur-sm">
      <div className="container mx-auto flex w-full items-center justify-between xl:py-4">
        <div>
          <Link
            href="/"
            className="flex cursor-pointer select-none items-center gap-2"
          >
            <h1 className=" text-2xl font-bold text-white">Ziphus</h1>
          </Link>
        </div>
        <div>
          <Link
            href="/spaces"
            className="flex cursor-pointer select-none items-center gap-2"
          >
            <h1 className="text-white">My Spaces</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Header;
