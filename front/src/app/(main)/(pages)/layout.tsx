import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="border-l-[1px] border-t-[1px] pb-20 h-screen rounded-tl-3xl border-muted-foreground/20 overflow-scroll">
      {children}
    </div>
  );
};

export default Layout;
