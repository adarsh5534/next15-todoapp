'use client';

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      {/* Left: TODOAPP Logo */}
      
      <div className="text-xl font-bold tracking-wide">
        TODOAPP
      </div>

      {/* Right: Login & Register Buttons */}
      <div className="flex items-center gap-4">
        <Button variant="outline">
          <LogIn className="mr-2 h-5 w-5" /> <Link href={'/login'}>Login</Link>
        </Button>
        <Button>
          <UserPlus className="mr-2 h-5 w-5" /> <Link href={'/register'}>Register</Link>
        </Button>
        
      </div>
    </nav>
  );
}
