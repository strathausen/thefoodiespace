"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaBell,
  FaBookBookmark,
  FaBowlRice,
  FaDoorOpen,
  FaPlus,
} from "react-icons/fa6";
import { useScopedI18n } from "locales/client";

type Props = {
  loggedIn: boolean;
  userImage?: string | null;
  onSearch?: (query: string) => void;
  searchQuery?: string;
};

const menuLinks = [
  { label: "home", link: "myRecipes", icon: <FaBowlRice /> },
  { label: "cookbooks", link: "bookmarks", icon: <FaBookBookmark /> },
  { label: "create", link: "editor", icon: <FaPlus /> },
  { label: "notifications", link: "notifications", icon: <FaBell /> },
  { label: "profile", link: "profile", icon: null },
] as const;

export function NavBar(props: Props) {
  const pathName = usePathname();
  const t = useScopedI18n("navBar");

  return (
    <div className="fixed top-0 flex h-screen flex-col pb-4 pl-6 pt-2 text-sm">
      <div title="tomato city">
        <Link href="/" className="gap-3 text-2xl text-accent ">
          <p className="font-vollkorn drop-shadow-hard">tomatovillage</p>
        </Link>
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-between font-vollkorn text-xl">
        <div className="mt-4 flex flex-col gap-5">
          {menuLinks.map(({ link, label, icon }) => (
            <Link
              key={link}
              href={`/${link}`}
              className={`flex items-center gap-3 hover:underline hover:decoration-accent ${
                pathName.startsWith(`/${link}`) ? "font-bold" : ""
              }`}
            >
              {link === "profile" ? (
                <Image
                  src={props.userImage ?? "/user.svg"}
                  width={28}
                  height={28}
                  className="-m-1 rounded-full object-cover shadow"
                  alt="user image"
                  style={{ width: 28, height: 28 }}
                />
              ) : (
                icon
              )}{" "}
              {t(label)}
            </Link>
          ))}
        </div>
        <Link
          href={props.loggedIn ? "/api/auth/signout" : "/api/auth/signin"}
          className="flex items-center gap-4 rounded-sm text-primary-darker transition"
        >
          <FaDoorOpen /> {props.loggedIn ? t("logout") : t("login")}
        </Link>
      </div>
    </div>
  );
}
