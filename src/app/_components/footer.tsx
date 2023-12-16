import { FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="m-4 w-full max-w-3xl rounded-lg">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center">
          © 2023{" "}
          <a href="https://tomatovillage.com/" className="hover:underline">
            tomato village™
          </a>
          . all rights reserved.
        </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm sm:mt-0">
          {["team", "about", "imprint", "privacy policy", "contact"].map(
            (link) => (
              <li key={link.replaceAll(' ', '_')}>
                <a
                  href={`/pages/${link}`}
                  className="mr-4 hover:underline hover:decoration-accent md:mr-6 "
                >
                  {link}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="flex items-center justify-center gap-1 text-center text-sm">
        made with <FaHeart className="text-accent" /> in berlin
      </div>
    </footer>
  );
}
