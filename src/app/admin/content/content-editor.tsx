"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { upsertContent, deleteContent } from "@/actions/content-actions";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  updatedAt: string;
}

export function ContentEditor({
  initialContent,
}: {
  initialContent: ContentItem[];
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("TEXT");
  const [loading, setLoading] = useState(false);

  function openNew() {
    setEditingItem(null);
    setKey("");
    setValue("");
    setType("TEXT");
    setDialogOpen(true);
  }

  function openEdit(item: ContentItem) {
    setEditingItem(item);
    setKey(item.key);
    setValue(item.value);
    setType(item.type);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingItem(null);
    setKey("");
    setValue("");
    setType("TEXT");
  }

  async function handleSave() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("key", key);
      formData.set("value", value);
      formData.set("type", type);
      await upsertContent(formData);
      toast.success(editingItem ? "Content updated" : "Content created");
      closeDialog();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(contentKey: string) {
    if (!confirm(`Delete content "${contentKey}"?`)) return;
    try {
      await deleteContent(contentKey);
      toast.success("Content deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      {/* Edit / New dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-900 border-white/15">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit: ${editingItem.key}` : "New Content"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g. hero_title"
                  disabled={!!editingItem}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/15 text-white">
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="MARKDOWN">Markdown</SelectItem>
                    <SelectItem value="IMAGE_URL">Image URL</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Textarea
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Content value..."
                rows={type === "JSON" || type === "HTML" ? 8 : 4}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !key}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content table */}
      <Card className="border-white/10 bg-[var(--theme-surface)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Content Entries</CardTitle>
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-1 h-4 w-4" />
            Add Content
          </Button>
        </CardHeader>
        <CardContent>
          {initialContent.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">
              No content entries yet. Click &quot;Add Content&quot; to create
              one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialContent.map((item) => (
                  <TableRow key={item.id} className="border-white/10">
                    <TableCell className="font-mono text-sm">
                      {item.key}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-white/60">
                      {item.value}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(item.key)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
