import Sidebar from "@/components/sidebar";
type Props = {
  children: React.ReactNode;
};
const Layout = async ({ children }: Props) => {
  return (
    <div className="flex overflow-hidden h-screen dark:bg-black">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
};
export default Layout;
