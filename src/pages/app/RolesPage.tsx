import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
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
  roleService,
  type Role,
} from "@/services/role.service";

interface RolesPageProps {}
export default function RolesPage({}: RolesPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paginationRef = useRef<PaginationHandle>(null);
  const { language } = useLanguageStore();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isProtected = (role: Role) =>
    role.name === "su" || role.name === "user";

  const openCreate = () => {
    setEditingRole(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description);
    setDialogOpen(true);
  };

  const openDelete = (role: Role) => {
    setDeletingRole(role);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingRole) {
        await roleService.update(editingRole.id, {
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        await roleService.create({
          name: name.trim(),
          description: description.trim(),
        });
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
    if (!deletingRole) return;
    setIsSubmitting(true);
    try {
      await roleService.delete(deletingRole.id);
      setDeleteDialogOpen(false);
      setDeletingRole(null);
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

  const columns = useMemo<PaginationColumn<Role>[]>(
    () => [
      {
        header: language({ id: "Aksi", en: "Action" }),
        strict: true,
        align: "right",
        render: (role) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
              <HiOutlinePencil size={16} />
            </Button>
            {!isProtected(role) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDelete(role)}
                className="text-neon-red hover:bg-neon-red/10"
              >
                <HiOutlineTrash size={16} />
              </Button>
            )}
          </div>
        ),
      },
      {
        header: language({ id: "Nama", en: "Name" }),
        sort: true,
        search: "name",
        render: (role) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{role.name}</span>
            {isProtected(role) && (
              <Badge variant="secondary">
                {language({ id: "Dilindungi", en: "Protected" })}
              </Badge>
            )}
          </div>
        ),
      },
      {
        header: language({ id: "Deskripsi", en: "Description" }),
        search: "description",
        render: (role) => (
          <span className="text-dark-300">
            {role.description || "-"}
          </span>
        ),
      },
      {
        header: language({ id: "Dibuat Pada", en: "Created At" }),
        sort: true,
        search: "created_at",
        render: (role) => formatDateTime(role.created_at),
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
            {language({ id: "Peran", en: "Roles" })}
          </h1>
          <p className="mt-1 text-sm text-dark-400">
            {language({
              id: "Kelola peran pengguna pada sistem",
              en: "Manage user roles in the system",
            })}
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <HiOutlinePlus size={16} />
          {language({ id: "Tambah Peran", en: "Add Role" })}
        </Button>
      </div>

      <Pagination
        ref={paginationRef}
        title={language({ id: "Daftar Peran", en: "Role List" })}
        columns={columns}
        function={roleService.getPaginate}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} width="480px">
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {editingRole
                ? language({ id: "Edit Peran", en: "Edit Role" })
                : language({ id: "Tambah Peran", en: "Add Role" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-name" required>
                {language({ id: "Nama Peran", en: "Role Name" })}
              </Label>
              <Input
                id="role-name"
                className="mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language({
                  id: "Masukkan nama peran",
                  en: "Enter role name",
                })}
                disabled={editingRole ? isProtected(editingRole) : false}
              />
            </div>
            <div>
              <Label htmlFor="role-description">
                {language({ id: "Deskripsi", en: "Description" })}
              </Label>
              <Input
                id="role-description"
                className="mt-1.5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language({
                  id: "Masukkan deskripsi",
                  en: "Enter description",
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
              disabled={isSubmitting || !name.trim()}
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
              {language({ id: "Hapus Peran", en: "Delete Role" })}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-dark-300">
            {language({
              id: "Apakah Anda yakin ingin menghapus peran",
              en: "Are you sure you want to delete role",
            })}{" "}
            <strong className="text-foreground">{deletingRole?.name}</strong>?{" "}
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
