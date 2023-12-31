export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-stone prose-h1:text-stone-500 prose-h2:text-stone-600 prose-h3:text-stone-700 m-auto mt-5 rounded px-10 py-6 backdrop-blur-3xl backdrop-brightness-110">
      {children}
    </div>
  );
}
