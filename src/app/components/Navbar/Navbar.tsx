/* eslint-disable @next/next/no-img-element */
"use client";

import LogoLong from "../../../../public/LogoLong.png";
import { Menu } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import NavbarProfileDropdown from "./NavbarProfileDropdown";
import { useIsAtTop } from "./Scroll";
import Image from "next/image";

export const Navbar = () => {
  const isAtTop = useIsAtTop();

  return (
    <div
      className={`navbar sticky top-0 z-50 justify-center p-3`}
      style={!isAtTop ? { borderBottom: "2px solid #eaeaea" } : {}}
    >
      {/* Blurred Background - Visible when over content */}
      <div
        className={twMerge(
          "absolute h-full w-full bg-base-100 backdrop-blur-sm",
          !isAtTop ? "bg-opacity-80" : "bg-opacity-20",
        )}
      ></div>

      {/* Navbar Content */}
      <div
        className={
          "relative flex h-full w-full max-w-6xl rounded-md md:w-[70%]"
        }
      >
        {/* Drawer */}
        <div className="drawer w-fit md:hidden">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              className="drawer-button btn btn-ghost btn-sm rounded-md"
              htmlFor="my-drawer"
            >
              <Menu />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
              <NavBarLinks />
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="mx-auto  flex flex-row md:ml-0 md:mr-auto">
          <Link
            href="/"
            className=" flex h-5 min-h-[20px] flex-row items-center font-normal capitalize hover:bg-none"
          >
            <Image src={LogoLong} alt="Logo" className="mr-2  h-10  w-auto" />
          </Link>
        </div>

        {/* Right links and profile dropdown */}
        <div className="relative mr-2 flex h-12 w-fit items-center">
          <div className="hidden md:flex">
            <NavBarLinks />
          </div>
          <div className="divider divider-horizontal my-2 ml-2 mr-4 hidden md:flex"></div>
          <NavbarProfileDropdown />
        </div>
      </div>
    </div>
  );
};

function NavBarLinks() {
  return (
    <div className="flex flex-col md:flex-row md:gap-2">
      <Link href="/exam/create">
        <button
          className="btn btn-ghost btn-sm w-full font-semibold capitalize"
          onClick={() => document.getElementById("my-drawer")?.click()}
        >
          our solutions
        </button>
      </Link>

      <Link href="/exam/label">
        <button
          className="btn btn-primary btn-sm w-full font-semibold capitalize"
          onClick={() => document.getElementById("my-drawer")?.click()}
        >
          contact us
        </button>
      </Link>
    </div>
  );
}
