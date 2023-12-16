"use client";
import {startCase} from "lodash";
import Link from "next/link";
import {GiTomato} from "react-icons/gi";

type Props = {
  loggedIn: boolean;
  onSearch?: (query: string) => void;
  searchQuery?: string;
};

export function NavBar(props: Props) {
  return (
    <div className="flex w-full items-center justify-between pt-2 text-sm">
      <div title="tomato city">
        <Link href="/" className="text-2xl">
          <GiTomato className="text-accent drop-shadow-hard" />
        </Link>
      </div>
      <div className="">
        <input
          className="rounded px-2 py-0.5 text-slate transition placeholder:text-black/40 focus:outline-none bg-white/40"
          size={20}
          placeholder="search"
          value={props.searchQuery}
          onChange={(e) => props.onSearch && props.onSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center justify-end gap-4">
        {["myRecipes", "editor", "profile"].map((link) => (
          <Link
            key={link}
            href={`/${link}`}
            className="hover:underline hover:decoration-accent"
          >
            {startCase(link)}
          </Link>
        ))}

        <Link
          href={props.loggedIn ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-sm bg-primary/20 px-2 py-0.5 text-primary-darker transition hover:bg-primary/10"
        >
          {props.loggedIn ? "sign out" : "sign in"}
        </Link>
      </div>
    </div>
  );
}
