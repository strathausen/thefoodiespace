export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-stone mx-auto mt-5 w-full max-w-2xl rounded px-10 py-6 backdrop-blur-3xl backdrop-brightness-110 prose-headings:font-vollkorn prose-h1:text-stone-500 prose-h2:text-stone-600 prose-h3:text-stone-700">
      {children}
    </div>
  );
}
