export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-pink m-auto mt-5 rounded px-10 py-6 backdrop-blur-3xl backdrop-brightness-110">
      {children}
    </div>
  );
}
