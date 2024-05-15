import { ReactNode } from "react";

type ModalProviderProps = {
  children: ReactNode;
};
type ModalData = {};
type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: ReactNode, featchData?: () => Promise<any>) => void;
  setClose: () => void;
};
