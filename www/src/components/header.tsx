"use client";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="left-0 right-0 h-16 bg-white shadow-md fixed top-0 w-full z-50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={"/"}>
            <h1 className="text-3xl font-bold text-[#06c]">CodeHaven</h1>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href={"/download"}>
              <Button
                variant="ghost"
                className="font-medium hover:text-primary transition-colors text-md rounded-full"
              >
                Join Beta
              </Button>
            </Link>
            <Link href={"https://github.com/himasnhu-at"}>
              <Button
                variant="secondary"
                className="font-medium hover:text-primary transition-colors text-md rounded-full"
              >
                Github
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-gray-800 hover:text-primary focus:outline-none">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the sections.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <SheetClose asChild>
                    <Link href={"/download"}>
                      <Button variant="ghost">Download</Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
