import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="secondary" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined} side="left" className="p-0">
        <VisuallyHidden.Root>
          <SheetTitle>Drawer</SheetTitle>
        </VisuallyHidden.Root>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
