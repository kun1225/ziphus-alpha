import Link from 'next/link';

function Header() {
  return (
    <header className="h-fit w-full bg-[#00000033] backdrop-blur-sm">
      <div className="container mx-auto flex w-full items-center justify-start xl:py-4">
        <Link
          href="/"
          className="flex cursor-pointer select-none items-center gap-2"
        >
          <h1 className=" text-3xl font-bold text-white">Ziphus</h1>
        </Link>
      </div>
    </header>
  );
}
export default Header;
