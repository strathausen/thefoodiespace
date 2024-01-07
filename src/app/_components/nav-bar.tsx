"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBell,
  FaBookBookmark,
  FaBowlRice,
  FaDoorOpen,
  FaPlus,
} from "react-icons/fa6";
import { useScopedI18n } from "locales/client";
import { LanguageSwitcher } from "components/buttons/language-switcher";
import { ProfileImage } from "./profile-image";

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
    <div className="xs:bottom-0 xs:flex-row xs:bg-white/50 xs:h-[100px] absolute top-0 z-50 flex h-screen flex-col pb-4 pl-6 pt-2 text-sm">
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
                <div className="-m-1">
                  <ProfileImage imageUrl={props.userImage} size={28} />
                </div>
              ) : (
                icon
              )}{" "}
              {t(label)}
            </Link>
          ))}
        </div>
        <div>
          <LanguageSwitcher />
          <Link
            href={props.loggedIn ? "/api/auth/signout" : "/api/auth/signin"}
            className="flex items-center gap-4 rounded-sm text-primary-darker transition"
          >
            <FaDoorOpen /> {props.loggedIn ? t("logout") : t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
