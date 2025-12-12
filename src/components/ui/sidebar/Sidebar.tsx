"use client";
import { logout } from "@/actions/auth/logout";
import { useUIStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { on } from "events";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    setIsAuthenticated(!!session?.user);
    setIsAdmin(session?.user.role === "admin");
  }, [session]);

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        ></div>
      )}

      {/* SideMenu*/}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          { "translate-x-full": !isSideMenuOpen }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => closeMenu()}
        ></IoCloseOutline>
        {/* Input */}
        <div className="relative mt-14">
          <IoSearchOutline
            size={20}
            className="absolute top-2 left-2"
          ></IoSearchOutline>
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          ></input>
        </div>
        {/* Menu */}
        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={30}></IoPersonOutline>
              <span className="ml-3 text-lg">Perfil</span>
            </Link>
            <Link
              href="/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30}></IoTicketOutline>
              <span className="ml-3 text-lg">Ordenes</span>
            </Link>
            <button
              onClick={() => logout()}
              className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoLogOutOutline size={30}></IoLogOutOutline>
              <span className="ml-3 text-lg">Salir</span>
            </button>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            onClick={() => logout()}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30}></IoLogInOutline>
            <span className="ml-3 text-lg">Ingresar</span>
          </Link>
        )}

        {/* Line Separator */}
        {isAdmin && (
          <div className="w-full h-px bg-gray-200 my-10 mb-14">
            <Link
              href="/admin/products"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={30}></IoShirtOutline>
              <span className="ml-3 text-lg">Productos</span>
            </Link>
            <Link
              href="/admin/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30}></IoTicketOutline>
              <span className="ml-3 text-lg">Ordenes</span>
            </Link>
            <Link
              href="/admin/users"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={30}></IoPeopleOutline>
              <span className="ml-3 text-lg">Usuarios</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};
