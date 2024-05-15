import Breadcrumb from "@/components/global/bread-crumb";

const Page = () => {
  return (
    <div className="flex flex-col gap-4 relative space-x-4 w-full">
      <header className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b gap-4 flex flex-col">
        <Breadcrumb />
        <h1 className="text-xl flex items-center ">Settings</h1>
      </header>
    </div>
  );
};
export default Page;
