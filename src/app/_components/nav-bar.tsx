"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FaBell,
  FaBookBookmark,
  FaBowlRice,
  FaDoorOpen,
  FaHorseHead,
  FaPlus,
} from "react-icons/fa6";
import { useScopedI18n } from "locales/client";
// import { LanguageSwitcher } from "components/buttons/language-switcher";
import { ProfileImage } from "./profile-image";
import { type Session } from "next-auth";
import { api } from "@/trpc/react";
import { useEffect } from "react";

type Props = {
  session: Session | null;
};

const BellDot = () => {
  const unreadNotificationsQuery = api.notification.getUnreadCount.useQuery();

  // TODO use useQuery for that?
  useEffect(() => {
    if (unreadNotificationsQuery.data) {
      const timeout = setInterval(() => {
        unreadNotificationsQuery.refetch().catch((e) => console.error(e));
      }, 1700);
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
    <div className="absolute bottom-0 z-50 flex h-screen max-h-[80px] w-full flex-row bg-white/60 pb-4 pt-2 text-sm backdrop-blur backdrop-brightness-110 md:top-0 md:max-h-none md:w-fit md:flex-col md:bg-transparent md:pl-6 md:backdrop-blur-none md:backdrop-brightness-100">
      <div title="tomato village" className="hidden md:block mt-2">
        <Link href="/" className="flex items-center gap-2">
          <div>
            <Image
              alt="cat in a planet rice bowl"
              src="/logo.png"
              width={52}
              height={52}
            />
          </div>
          <p className="font-vollkorn text-2xl" style={{ lineHeight: 0.6 }}>
            <span className="text-lg relative" style={{ lineHeight: 0.65,left:12 }}>
              the
            </span>
            <br />
            foodie
            <br />
            <span className="pl-2">space</span>
          </p>
        </Link>
      </div>
      <div className="mt-2 flex flex-1 flex-col justify-between font-vollkorn text-xl md:mt-6">
        <div className="flex flex-row justify-center gap-5 md:mt-4 md:flex-col">
          {menuLinks.map(({ link, label, icon }) => (
            <Link
              key={link}
              href={`/${link === "feed" && !props.session?.user ? "" : link}`}
              className={`flex flex-col items-center gap-3 drop-shadow-white hover:underline hover:decoration-accent md:flex-row ${
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
              <span className="text-sm md:text-xl">{t(label)}</span>
            </Link>
          ))}
          <Link
            href={
              props.session?.user
                ? `/user/${props.session.user.id}`
                : `/api/auth/signin`
            }
            className={`flex flex-col items-center gap-3 drop-shadow-white hover:underline hover:decoration-accent md:flex-row ${
              pathName.startsWith(`/user/${props.session?.user.id}`)
                ? "font-bold"
                : ""
            }`}
          >
            <div className={props.session ? "-m-1" : ""}>
              {props.session ? (
                <ProfileImage imageUrl={props.session?.user.image} size={28} />
              ) : (
                <FaHorseHead />
              )}
            </div>{" "}
            <span className="text-sm md:text-xl">{t("profile")}</span>
          </Link>
        </div>
        <div className="hidden text-primary-darker md:block">
          <div className="pb-3">
            <Link
              href="https://www.zupafeed.com/campaign/clsa7g66k0007u2z77f2g0e4o"
              target="_blank"
            >
              feed me feedback 🔥
            </Link>
          </div>
          {/* <LanguageSwitcher /> */}
          <Link
            href={props.session ? "/api/auth/signout" : "/api/auth/signin"}
            className="flex items-center gap-4 rounded-sm transition"
          >
            <FaDoorOpen /> {props.session ? t("logout") : t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
