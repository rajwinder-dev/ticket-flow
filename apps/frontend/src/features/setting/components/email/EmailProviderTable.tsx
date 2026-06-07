
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EmailProviderSchema } from "@repo/schemas";
import { Plus } from "lucide-react";
import { useState } from "react";
import useEmail from "../../hooks";
import { DeleteProviderDialog } from "./DeleteProviderDialog";
import { ProviderFormDialog } from "./ProviderFormDialog";
import { ProviderTable } from "./ProviderTable";
import SmtpFormDialog from "../SmtpFormDialog";
export default function EmailProviderTable() {
  const { deleteProvider } = useEmail();
  const [formOpen, setFormOpen] = useState(false);
  const [smtpFormOpen, setSmtpFormOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editProvider, setEditProvider] = useState<EmailProviderSchema | null>(null);
  const [editSmtp, setEditSmtp] = useState<EmailProviderSchema | null>(null);
  function confirmDelete(id: string) {
    setDeleteTarget(id);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteProvider(deleteTarget);
  }
  function openEdit(provider: EmailProviderSchema) {
    setEditProvider(provider);
    setFormOpen(true);
 }

  function openAdd() {
    setEditProvider(null);
    setFormOpen(true);
  }
  function openAddSmtp() {
    setEditSmtp(null);
    setSmtpFormOpen(true);
  }
  return (
    <Card className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Email Providers</h2>
          <p className="text-muted-foreground text-sm">
            Manage outbound email provider configurations.
          </p>
        </div>
        <div className="flex gap-4">
          {/* <Button onClick={openAddSmtp} size="sm" className="gap-2" variant={"secondary"}> */}
          {/*   <Plus className="h-4 w-4" /> */}
          {/*   Add smtp */}
          {/* </Button> */}
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Provider
          </Button>
        </div>
      </div>

      {/* Table */}
      <ProviderTable onEdit={openEdit} onDelete={confirmDelete} onAddClick={openAdd} />
      
      {/* Add / Edit Dialog */}
      <ProviderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEditing={!!editProvider}
        providerData={editProvider}
      />

      {/* Delete Confirmation */}
      <DeleteProviderDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <SmtpFormDialog open={smtpFormOpen} onOpenChange={setSmtpFormOpen} isEditing={!!editSmtp} />
    </Card>
  );
}
