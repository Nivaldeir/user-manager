"use client";
import { columns } from "./_components/table-users/columns";
import { DataTable } from "./_components/table-users/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/services/user";
import { useQuery } from "react-query";

const DashboardPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: 1,
  });
  console.log(data);
  return (
    <section className="flex flex-col gap-4 relative space-x-4">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Usuarios
      </h1>
      {!isLoading && !error && <DataTable columns={columns} data={data.data} />}
      {isLoading &&
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-[90vw] h-[45px] rounded-xl" />
        ))}
      {error ? (
        <div className="w-full">
          <p className="text-center text-foreground">
            Você não tem permissão sufiente
          </p>
        </div>
      ) : null}
    </section>
  );
};
export default DashboardPage;
