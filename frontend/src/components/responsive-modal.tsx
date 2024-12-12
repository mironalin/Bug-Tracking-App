import { useMedia } from "react-use";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({ children, open, onOpenChange }: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          aria-describedby={undefined}
          className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]"
        >
          <VisuallyHidden.Root>
            <DialogTitle>Dialog</DialogTitle>
          </VisuallyHidden.Root>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent aria-describedby={undefined}>
        <VisuallyHidden.Root>
          <DrawerTitle>Drawer</DrawerTitle>
        </VisuallyHidden.Root>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
