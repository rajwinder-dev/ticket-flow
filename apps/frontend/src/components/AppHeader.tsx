import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import { useGlobalContext } from "@/context/GlobalContext";
import { Moon, Sun } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button } from "./ui/button";
export function AppHeader() {
  const location = useLocation();
  const { orgId } = useParams();
  const { theme, toggleTheme } = useGlobalContext();
  const breadCrumpData = location.pathname.split("/");
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        {orgId && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumpData.slice(1, breadCrumpData.length).map((link, index) => (
                  <Fragment key={link}>
                    <BreadcrumbItem className="hidden md:block" key={link}>
                      <BreadcrumbLink asChild>
                        <Link
                          to={breadCrumpData.slice(0, index + 2).join("/")}
                          className="capitalize"
                        >
                          {link.length < 10 ? link : `${link.slice(0, 8)}...`}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index !== breadCrumpData.length - 2 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={() => toggleTheme()}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <UserProfile />
      </div>
    </header>
  );
}
