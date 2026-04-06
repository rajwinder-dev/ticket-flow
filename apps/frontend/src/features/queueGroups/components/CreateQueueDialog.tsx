import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CreateQueueDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
  groupName: string;
}

export function CreateQueueDialog({ open, onClose, onCreate, groupName }: CreateQueueDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim());
    setName("");
    setDescription("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Queue — {groupName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="q-name">Queue name</Label>
            <Input
              id="q-name"
              placeholder="e.g. Urgent Issues"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="q-desc">Description</Label>
            <Textarea
              id="q-desc"
              placeholder="What kind of tickets go here?"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
            Add Queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
