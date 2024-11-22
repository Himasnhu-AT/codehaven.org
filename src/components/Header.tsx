import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#3C3C3C] text-[#CCCCCC]">
      <div className="flex items-center">
        <span className="text-sm font-medium">VS Code-like Project</span>
      </div>
      {/* Add a search bar */}
      <div className="flex items-center space-x-2 w-1/6">
        <Input
          type="text"
          placeholder="Search"
          className="px-2 py-1 bg-[#4C4C4C] text-[#CCCCCC] rounded-full "
        />
      </div>
      <div className="flex items-center space-x-2">
        {/*  <Button variant="ghost" size="sm">
          File
        </Button>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          View
          </Button>*/}
        <Button variant="ghost" size="sm">
          Help
        </Button>
      </div>
    </header>
  );
};

export default Header;
