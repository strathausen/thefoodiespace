import Link from "next/link";

export default function NotFound() {
  return (
    <div className="m-auto flex-col items-center justify-center gap-4">
      <h2 className="font-vollkorn text-2xl">not found</h2>
      <p>the page you seek is not here</p>
      <p>try searching instead</p>
      <p>or maybe you could</p>
      <p>try a different page</p>
      <Link className="font-bold" href="/">
        return home
      </Link>
    </div>
  );
}
