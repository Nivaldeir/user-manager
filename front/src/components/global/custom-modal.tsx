import { useModal } from "@/providers/modal-provider";
import { ReactNode, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
type Props = {
  subheading: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isButtonClosed?: boolean;
};

const CustomModal = ({ children, subheading, isButtonClosed }: Props) => {
  const { setClose, isOpen } = useModal();
  const handleClose = () => setClose();
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-10">
        <DialogHeader>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
        {isButtonClosed && (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="w-full mt-2"
                variant={"ghost"}
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
// import { useModal } from "@/providers/modal-provider";
// import { ReactNode } from "react";
// import { Button } from "../ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// type Props = {
//   subheading: string;
//   children: ReactNode;
//   defaultOpen?: boolean;
// };

// const CustomModal = ({ children, subheading, defaultOpen }: Props) => {
//   const { setClose, isOpen } = useModal();
//   const handleClose = () => setClose();
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Permissões</Button>
//       </DialogTrigger>
//       <DialogContent className="p-10">
//         {children}
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button
//               className="w-full mt-2"
//               variant={"ghost"}
//               onClick={handleClose}
//             >
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CustomModal;
