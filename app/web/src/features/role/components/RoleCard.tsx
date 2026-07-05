import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PermissionModule, RoleSchema } from "@org/zod";
import { ChevronRight, Pencil, Shield, ShieldCheck, Trash2 } from "lucide-react";
import useRole from "../hooks";
import { useRoleStore } from "../store";
import { totalPermCount } from "../utils";
import { RoleFormDialog } from "./RoleFormDialog";

interface RoleCardProps {
  role: RoleSchema;
}

export function RoleCard({ role }: RoleCardProps) {
  const { setRoleId, roleId } = useRoleStore();
  const total = totalPermCount(role?.permissions);
  const isSelected = role.id === roleId;

  const { deleteRole } = useRole();
  return (
    <Card
      className={`hover:border-primary/40 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary ring-primary/20 shadow-md ring-2" : ""
      }`}
      onClick={() => setRoleId(role.id)}
    >
      <CardHeader className="pr-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck
              className={`h-4 w-4 shrink-0 ${
                isSelected ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <CardTitle className="truncate text-base">{role.name}</CardTitle>
          </div>

          <div className="flex shrink-0 gap-1">
            <RoleFormDialog
              mode="edit"
              initialRole={role}
              trigger={
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive h-7 w-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{role.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All users assigned this role will lose its
                    permissions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteRole(role.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {role.description && (
          <CardDescription className="mt-0.5 line-clamp-1 text-xs">
            {role.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {(Object.entries(role.permissions) as [PermissionModule, string[]][])
            .filter(([, v]) => v.length > 0)
            .map(([module]) => {
              return (
                <Badge key={module} variant="secondary" className="gap-1 px-1.5 py-0.5 text-xs">
                  <Shield className={`h-3 w-3`} />
                  {module}
                </Badge>
              );
            })}
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{total} permissions</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </CardContent>
    </Card>
  );
}
