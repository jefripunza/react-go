import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import { useLanguageStore } from "@/stores/languageStore";
import { formatDateTime } from "@/utils/datetime";
import Pagination, {
  type PaginationColumn,
  type PaginationHandle,
} from "@/components/Pagination";
import {
  masterdataService,
  type MasterDataItem,
} from "@/services/masterdata.service";

interface MasterDataPageProps {}
export default function MasterDataPage({}: MasterDataPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paginationRef = useRef<PaginationHandle>(null);
  const { language } = useLanguageStore();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MasterDataItem | null>(null);

  // Form state
  const [category, setCategory] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const openCreate = () => {
    setEditingItem(null);
    setCategory("");
    setKey("");
    setValue("");
    setDialogOpen(true);
  };

  const openEdit = (item: MasterDataItem) => {
    setEditingItem(item);
    setCategory(item.category);
    setKey(item.key);
    setValue(item.value);
    setDialogOpen(true);
  };

  const openDelete = (item: MasterDataItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!category.trim() || !key.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        category: category.trim(),
        key: key.trim(),
        value: value.trim(),
      };
      if (editingItem) {
        await masterdataService.update(editingItem.id, payload);
      } else {
        await masterdataService.create(payload);
      }
      setDialogOpen(false);
      await paginationRef.current?.reload();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Operation failed";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      await masterdataService.delete(deletingItem.id);
      setDeleteDialogOpen(false);
      setDeletingItem(null);
      await paginationRef.current?.reload();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Delete failed";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo<PaginationColumn<MasterDataItem>[]>(
    () => [
      {
        header: language({ id: "Aksi", en: "Action" }),
        strict: true,
        align: "right",
        render: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
              <HiOutlinePencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDelete(item)}
              className="text-neon-red hover:bg-neon-red/10"
            >
              <HiOutlineTrash size={16} />
            </Button>
          </div>
        ),
      },
      {
        header: language({ id: "Kategori", en: "Category" }),
        sort: true,
        search: "category",
        render: (item) => (
          <span className="font-medium text-accent-400">{item.category}</span>
        ),
      },
      {
        header: language({ id: "Kunci", en: "Key" }),
        sort: true,
        search: "key",
        render: (item) => (
          <span className="font-mono text-sm">{item.key}</span>
        ),
      },
      {
        header: language({ id: "Nilai", en: "Value" }),
        search: "value",
        render: (item) => (
          <span className="text-dark-300 max-w-xs truncate block">
            {item.value || "-"}
          </span>
        ),
      },
      {
        header: language({ id: "Dibuat Pada", en: "Created At" }),
        sort: true,
        search: "created_at",
        render: (item) => formatDateTime(item.created_at),
      },
    ],
    [language],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {language({ id: "Data Master", en: "Master Data" })}
          </h1>
          <p className="mt-1 text-sm text-dark-400">
            {language({
              id: "Kelola data master pada sistem",
              en: "Manage master data in the system",
            })}
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <HiOutlinePlus size={16} />
          {language({ id: "Tambah Data", en: "Add Data" })}
        </Button>
      </div>

      <Pagination
        ref={paginationRef}
        title={language({ id: "Daftar Data Master", en: "Master Data List" })}
        columns={columns}
        function={masterdataService.getPaginate}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} width="520px">
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? language({ id: "Edit Data Master", en: "Edit Master Data" })
                : language({
                    id: "Tambah Data Master",
                    en: "Add Master Data",
                  })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="md-category" required>
                {language({ id: "Kategori", en: "Category" })}
              </Label>
              <Input
                id="md-category"
                className="mt-1.5"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={language({
                  id: "Masukkan kategori",
                  en: "Enter category",
                })}
              />
            </div>
            <div>
              <Label htmlFor="md-key" required>
                {language({ id: "Kunci", en: "Key" })}
              </Label>
              <Input
                id="md-key"
                className="mt-1.5"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={language({
                  id: "Masukkan kunci",
                  en: "Enter key",
                })}
              />
            </div>
            <div>
              <Label htmlFor="md-value">
                {language({ id: "Nilai", en: "Value" })}
              </Label>
              <Input
                id="md-value"
                className="mt-1.5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={language({
                  id: "Masukkan nilai",
                  en: "Enter value",
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {language({ id: "Batal", en: "Cancel" })}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || !category.trim() || !key.trim()}
            >
              {language({ id: "Simpan", en: "Save" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogContent onClose={() => setDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {language({
                id: "Hapus Data Master",
                en: "Delete Master Data",
              })}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-dark-300">
            {language({
              id: "Apakah Anda yakin ingin menghapus data",
              en: "Are you sure you want to delete data",
            })}{" "}
            <strong className="text-foreground">
              {deletingItem?.category} / {deletingItem?.key}
            </strong>
            ?{" "}
            {language({
              id: "Tindakan ini tidak dapat dibatalkan.",
              en: "This action cannot be undone.",
            })}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {language({ id: "Batal", en: "Cancel" })}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {language({ id: "Hapus", en: "Delete" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
