const grainyStyle = {
  backgroundImage: "url(https://grainy-gradients.vercel.app/noise.svg)",
  filter: "brightness(1.05) saturate(2)",
};

export default function RecipePage() {
  return (
    <div className="mt-6">
      playground
      <div>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Purple to Blue
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          Cyan to Blue
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
        >
          Green to Blue
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
        >
          Purple to Pink
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800"
        >
          Pink to Orange
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-teal-200 to-lime-200 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:ring-lime-200 dark:focus:ring-teal-700"
        >
          Teal to Lime
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-bl focus:ring-4 focus:ring-red-100 dark:focus:ring-red-400"
        >
          Red to Yellow
        </button>
      </div>
      <div>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Blue
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
        >
          Green
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          Cyan
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
        >
          Teal
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-br focus:ring-4 focus:ring-lime-300 dark:focus:ring-lime-800"
        >
          Lime
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
        >
          Red
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
        >
          Pink
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
        >
          Purple
        </button>
      </div>
      <div>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:shadow-lg dark:shadow-blue-800/80 dark:focus:ring-blue-800 "
        >
          Blue
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-green-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:shadow-lg dark:shadow-green-800/80 dark:focus:ring-green-800"
        >
          Green
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-cyan-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-cyan-300 dark:shadow-lg dark:shadow-cyan-800/80 dark:focus:ring-cyan-800"
        >
          Cyan
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-teal-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-teal-300 dark:shadow-lg dark:shadow-teal-800/80 dark:focus:ring-teal-800"
        >
          Teal
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 px-5 py-2.5 text-center text-sm font-medium text-gray-900 shadow-lg shadow-lime-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-lime-300 dark:shadow-lg dark:shadow-lime-800/80 dark:focus:ring-lime-800"
        >
          Lime
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-red-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:shadow-lg dark:shadow-red-800/80 dark:focus:ring-red-800"
        >
          Red
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-pink-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-pink-300 dark:shadow-lg dark:shadow-pink-800/80 dark:focus:ring-pink-800"
        >
          Pink
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800"
        >
          Purple
        </button>
      </div>
      <div>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Purple to blue
          </span>
        </button>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Cyan to blue
          </span>
        </button>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-400 to-blue-600 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-green-200 group-hover:from-green-400 group-hover:to-blue-600 dark:text-white dark:focus:ring-green-800">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Green to blue
          </span>
        </button>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-purple-200 group-hover:from-purple-500 group-hover:to-pink-500 dark:text-white dark:focus:ring-purple-800">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Purple to pink
          </span>
        </button>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Pink to orange
          </span>
        </button>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Teal to Lime
          </span>
        </button>
        <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400">
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            Red to Yellow
          </span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-6 rounded bg-white p-20 shadow">
        <button
          // style={grainyStyle}
          className="pressed:shadow-0 rounded bg-yellow-100 bg-gradient-to-l from-yellow-100 to-yellow-200 px-3 py-1 text-yellow-950 shadow transition hover:shadow-md active:shadow-sm"
        >
          edit
        </button>
        <button
          style={grainyStyle}
          className="pressed:shadow-0 pressed:top-1 rounded bg-yellow-200 px-3 py-1 text-yellow-950 shadow transition hover:shadow-md active:shadow-sm"
        >
          store
        </button>
        <button
          style={grainyStyle}
          className="pressed:shadow-0 rounded bg-green-300 px-3 py-1 text-green-950 shadow transition hover:shadow-md active:shadow-sm"
        >
          login
        </button>
        <button
          style={grainyStyle}
          className="pressed:shadow-0 rounded bg-red-200 px-3 py-1 text-yellow-950 shadow transition hover:shadow-md active:shadow-sm"
        >
          like
        </button>
        <button className="pressed:shadow-0 rounded bg-red-200 px-3 py-1 text-yellow-950 shadow transition hover:shadow-md active:shadow-sm">
          delete
        </button>
        {[...Array<number>(11)].map((_, i) => (
          <button
            key={i}
            style={{
              backgroundImage:
                "url(https://grainy-gradients.vercel.app/noise.svg)",
              filter: `brightness(1.1) hue-rotate(${i * 33}deg)`,
            }}
            className="pressed:shadow-0 rounded bg-green-300 px-3 py-1 text-green-950 shadow transition hover:shadow-md active:shadow-sm"
          >
            save
          </button>
        ))}
      </div>
    </div>
  );
}
