import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
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

  return (
    <div className="bg-card rounded-lg border border-blue-300">
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
          {isLoadingEmailProviders ? (
            // Proportional layout skeletons matching the 3 current visible columns
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-md" /> {/* Badge Placeholder */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" /> {/* From Email Placeholder */}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit button placeholder */}
                    <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete button placeholder */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : providers?.length === 0 ? (
            <TableRow>
              {/* Changed colSpan to 3 to accurately align across visible columns */}
              <TableCell colSpan={3} className="text-muted-foreground h-32 text-center">
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
