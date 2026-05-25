"use client";
import { GoHome } from "react-icons/go";
import { CiBellOn } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const session = useSession();
  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-[#1E40AF] text-white shadow sm:bg-white sm:text-[#1E40AF]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-[100px]">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <GoHome strokeWidth={1} size={22} />
          <span>PropertyPulse</span>
        </Link>

        <nav className="max-sm:hidden">
          <NavLinks isMobile={false} />
        </nav>

        <div className="flex w-[64px] items-center justify-between">
          <button
            type="button"
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center"
            aria-label="Notifications"
          >
            <CiBellOn strokeWidth={1} size={22} />
            <span className="absolute right-[3px] top-[2px] flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-red-700 px-[3px] text-[10px] leading-none text-white">
              2
            </span>
          </button>
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center"
            aria-label="Profile"
          >
            {session.status === "authenticated" ? (
              <Image
                src={session.data?.user.image || ""}
                alt={session.data?.user.name || ""}
                width={30}
                height={30}
                className="rounded-full object-cover border border-2 border-gray-700 "
              />
            ) : (
              <CgProfile size={22} />
            )}
          </Link>
        </div>
      </div>

      <div className="sm:hidden">
        <NavLinks isMobile={true} />
      </div>
    </header>
  );
}
