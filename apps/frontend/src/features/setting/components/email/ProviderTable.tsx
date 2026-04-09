"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmailProviderSchema } from "@repo/schemas";
import { Pencil, Trash2 } from "lucide-react";
import useEmail from "../../hooks";

type Props = {
  onEdit: (provider: EmailProviderSchema) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
};

export function ProviderTable({ onEdit, onDelete, onAddClick }: Props) {
  const { emailProviders, isLoadingEmailProviders } = useEmail();
  const providers = emailProviders?.data;
  if (isLoadingEmailProviders) return <div>Loading....</div>;
  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>From Email</TableHead>
            {/* <TableHead>API Key</TableHead>
            <TableHead>Webhook Secret</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground h-32 text-center">
                No providers configured.{" "}
                <button
                  onClick={onAddClick}
                  className="hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Add one
                </button>
                .
              </TableCell>
            </TableRow>
          ) : (
            providers?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Badge variant="secondary">{p.providerType}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{p.fromEmail}</TableCell>
                {/* <TableCell className="text-muted-foreground font-mono text-sm">*********</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">*********</TableCell> */}
                <TableCell className="space-x-2 text-right">
                  {p.providerType !== "SMTP" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(p)}
                      aria-label="Edit provider"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(p.id)}
                    aria-label="Delete provider"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
