"use client";
import Breadcrumb from "@/components/global/bread-crumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "react-query";
import HeaderRole from "./_componenets/header";
import { DataTable } from "./_componenets/table/data-table";
import { columns } from "./_componenets/table/columns";
import { getRoles } from "@/services/role";
import { getPermissions } from "@/services/permission";

const Page = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <section className="flex flex-col gap-4 relative space-x-4 w-full">
      <header className="fixed left-[85px] top-0 z-[10] w-full p-6 bg-background/50 backdrop-blur-lg border-b gap-4 flex flex-col">
        <Breadcrumb />
        <h1 className="text-xl flex items-center ">Cargos</h1>
      </header>
      <aside className="mt-28 p-4">
        <HeaderRole />
        {!isLoading && !error && <DataTable columns={columns} data={data} />}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-[90vw] h-[45px] rounded-xl mt-2"
            />
          ))}
        {error ? (
          <div className="w-full">
            <p className="text-center text-foreground">
              Você não tem permissão
            </p>
          </div>
        ) : null}
      </aside>
    </section>
  );
};
export default Page;
