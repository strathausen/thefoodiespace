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
import { type Session } from "next-auth";
import { api } from "@/trpc/react";
import { useEffect } from "react";

type Props = {
  session: Session | null;
};

const BellDot = () => {
  const unreadNotificationsQuery = api.notification.getUnreadCount.useQuery();

  useEffect(() => {
    if (unreadNotificationsQuery.data) {
      const timeout = setInterval(() => {
        unreadNotificationsQuery.refetch().catch((e) => console.error(e));
      }, 1200);
      return () => {
        clearInterval(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadNotificationsQuery.data]);
  return (
    <div className="relative">
      <FaBell />
      {!!unreadNotificationsQuery.data && (
        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
          {unreadNotificationsQuery.data}
        </div>
      )}
    </div>
  );
};

const menuLinks = [
  { label: "home", link: "feed", icon: <FaBowlRice /> },
  { label: "cookbooks", link: "bookmarks", icon: <FaBookBookmark /> },
  { label: "create", link: "editor", icon: <FaPlus /> },
  { label: "notifications", link: "notifications", icon: <BellDot /> },
] as const;

export function NavBar(props: Props) {
  const pathName = usePathname();
  const t = useScopedI18n("navBar");

  return (
    <div className="absolute bottom-0 z-50 flex h-screen max-h-[80px] w-full flex-row bg-white/60 pb-4 pt-2 text-sm backdrop-blur-sm backdrop-brightness-110 sm:top-0 sm:max-h-none sm:w-fit sm:flex-col sm:bg-transparent sm:pl-6 sm:backdrop-blur-none sm:backdrop-brightness-100">
      <div title="tomato village" className="hidden sm:block">
        <Link href="/" className="gap-3 text-2xl text-accent">
          <p className="font-vollkorn drop-shadow-hard">thefoodie.space</p>
        </Link>
      </div>
      <div className="mt-2 flex flex-1 flex-col justify-between font-vollkorn text-xl sm:mt-6">
        <div className="flex flex-row justify-center gap-5 sm:mt-4 sm:flex-col">
          {menuLinks.map(({ link, label, icon }) => (
            <Link
              key={link}
              href={`/${link === "feed" && !props.session?.user ? "" : link}`}
              className={`flex flex-col items-center gap-3 drop-shadow-white hover:underline hover:decoration-accent sm:flex-row ${
                pathName.startsWith(`/${link}`) ? "font-bold" : ""
              }`}
            >
              {label === "notifications" ? (
                props.session ? (
                  icon
                ) : (
                  <FaBell />
                )
              ) : (
                icon
              )}{" "}
              <span className="text-sm sm:text-xl">{t(label)}</span>
            </Link>
          ))}
          <Link
            href={
              props.session?.user
                ? `/user/${props.session.user.id}`
                : `/api/auth/signin`
            }
            className={`flex flex-col items-center gap-3 drop-shadow-white hover:underline hover:decoration-accent sm:flex-row ${
              pathName.startsWith(`/user/${props.session?.user.id}`)
                ? "font-bold"
                : ""
            }`}
          >
            <div className="-m-1">
              <ProfileImage imageUrl={props.session?.user.image} size={28} />
            </div>{" "}
            <span className="text-sm sm:text-xl">{t("profile")}</span>
          </Link>
        </div>
        <div className="hidden sm:block">
          <LanguageSwitcher />
          <Link
            href={props.session ? "/api/auth/signout" : "/api/auth/signin"}
            className="flex items-center gap-4 rounded-sm text-primary-darker transition"
          >
            <FaDoorOpen /> {props.session ? t("logout") : t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
