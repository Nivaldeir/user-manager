"use client";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const url = usePathname();
  return (
    <BreadcrumbComponent>
      <BreadcrumbList key={"sd4a56w4d5as4d5a4w5d4asd"}>
        {url.split("/").map((e, index) => {
          if (index != 0) {
            return (
              <>
                <BreadcrumbItem key={e + "_" + index}>
                  <BreadcrumbLink href={e}>{e}</BreadcrumbLink>
                </BreadcrumbItem>
                {index != url.split("/").length - 1 && <BreadcrumbSeparator />}
              </>
            );
          }
        })}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};

export default Breadcrumb;
