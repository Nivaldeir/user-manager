"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { menuOptions } from "@/lib/constant";
import clsx from "clsx";
import { Separator } from "../ui/separator";
import {
  Database,
  GitBranch,
  LogOut,
  LucideMousePointerClick,
} from "lucide-react";
import { ModeToggle } from "../global/mode-toggle";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";

type Props = {};

const MenuOptions = ({}: Props) => {
  const pahtName = usePathname();
  return (
    <nav className="dark:bg-black h-screen overflow-scroll justify-between flex items-center flex-col gap-10 py-6 px-2">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link href={"/"} className="flex font-bold flex-row">
          Manager
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "group h-8 w-8 flex items-center justify-center scale-[1.5] rounded-lg p-[-3] cursor-pointer",
                        {
                          "dark:bg-[#2F006B] bg-[#EEE0FF] ":
                            pahtName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component
                        selected={pahtName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        <Separator />
      </div>
      <div className="flex items-center justify-center flex-col gap-4">
        <Button variant="outline" size="icon" onClick={() => signOut()}>
          <LogOut size={18} />
          <span className="sr-only">Sair</span>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default MenuOptions;
