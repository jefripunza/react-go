import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguageStore } from "@/stores/languageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
import satellite from "@/lib/satellite";
import type { Response } from "@/types/response";
import type { Rule } from "@/stores/ruleStore";
import { sidebarLinks } from "@/routers";
import { HiChevronDown, HiChevronRight, HiOutlinePlus } from "react-icons/hi2";

// ─── Types ──────────────────────────────────────────────────────────

interface RoleItem {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

interface DivisionGroup {
  id: number;
  name: string;
  description: string;
  roles: RoleItem[];
}

const ACTIONS = ["create", "read", "update", "delete", "set"] as const;
type ActionType = (typeof ACTIONS)[number];

// ─── Component ──────────────────────────────────────────────────────

export default function RolesPage() {
  const { language } = useLanguageStore();
  const [divisions, setDivisions] = useState<DivisionGroup[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingKeys, setUpdatingKeys] = useState<Set<string>>(new Set());

  // Track open state for accordions
  const [openDivisions, setOpenDivisions] = useState<Set<number>>(new Set());
  const [openRoles, setOpenRoles] = useState<Set<number>>(new Set());

  // Add Division dialog
  const [divisionDialogOpen, setDivisionDialogOpen] = useState(false);
  const [divisionForm, setDivisionForm] = useState({
    name: "",
    description: "",
  });
  const [isDivisionSubmitting, setIsDivisionSubmitting] = useState(false);

  // Add Role dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [roleTargetDivisionId, setRoleTargetDivisionId] = useState<
    number | null
  >(null);
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);

  // Menu list from sidebar paths
  const menuList = useMemo(() => {
    return sidebarLinks
      .filter((link) => link.path && link.strict === true && !link.isHide)
      .map((link) => ({
        key: link.path as string,
        label: language(link.label),
      }));
  }, [language]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rolesRes, rulesRes] = await Promise.all([
        satellite.get<Response<{ divisions: DivisionGroup[] }>>(
          "/api/role/all",
        ),
        satellite.get<Response<{ rows: Rule[] }>>("/api/rule/list"),
      ]);

      const divs = rolesRes.data.data.divisions;
      setDivisions(divs);
      setRules(rulesRes.data.data.rows);

      // Default: all accordions open
      setOpenDivisions(new Set(divs.map((d) => d.id)));
      const roleIds = new Set<number>();
      divs.forEach((d) => d.roles.forEach((r) => roleIds.add(r.id)));
      setOpenRoles(roleIds);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get rule state for a specific role+menu+action combo
  const getRuleState = useCallback(
    (roleId: number, menuKey: string, action: ActionType): boolean => {
      const rule = rules.find(
        (r) => r.role_id === roleId && r.key === menuKey && r.action === action,
      );
      return rule ? rule.state : false;
    },
    [rules],
  );

  // Handle checkbox toggle
  const handleToggle = useCallback(
    async (roleId: number, menuKey: string, action: ActionType) => {
      const compositeKey = `${roleId}-${menuKey}-${action}`;
      if (updatingKeys.has(compositeKey)) return;

      const currentState = getRuleState(roleId, menuKey, action);
      const newState = !currentState;

      // Optimistic update
      setRules((prev) => {
        const idx = prev.findIndex(
          (r) =>
            r.role_id === roleId && r.key === menuKey && r.action === action,
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], state: newState };
          return updated;
        }
        return [
          ...prev,
          { id: 0, role_id: roleId, key: menuKey, action, state: newState },
        ];
      });

      setUpdatingKeys((prev) => new Set(prev).add(compositeKey));

      try {
        await satellite.post("/api/rule/set", {
          data: [{ role_id: roleId, key: menuKey, action, state: newState }],
        });
      } catch {
        setRules((prev) => {
          const idx = prev.findIndex(
            (r) =>
              r.role_id === roleId && r.key === menuKey && r.action === action,
          );
          if (idx >= 0) {
            const reverted = [...prev];
            reverted[idx] = { ...reverted[idx], state: currentState };
            return reverted;
          }
          return prev;
        });
      } finally {
        setUpdatingKeys((prev) => {
          const next = new Set(prev);
          next.delete(compositeKey);
          return next;
        });
      }
    },
    [getRuleState, updatingKeys],
  );

  // Toggle row (all actions for a menu in a role)
  const handleToggleRow = useCallback(
    async (roleId: number, menuKey: string) => {
      const allChecked = ACTIONS.every((a) => getRuleState(roleId, menuKey, a));
      const newState = !allChecked;

      setRules((prev) => {
        const updated = [...prev];
        for (const action of ACTIONS) {
          const idx = updated.findIndex(
            (r) =>
              r.role_id === roleId && r.key === menuKey && r.action === action,
          );
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], state: newState };
          } else {
            updated.push({
              id: 0,
              role_id: roleId,
              key: menuKey,
              action,
              state: newState,
            });
          }
        }
        return updated;
      });

      try {
        await satellite.post("/api/rule/set", {
          data: ACTIONS.map((action) => ({
            role_id: roleId,
            key: menuKey,
            action,
            state: newState,
          })),
        });
      } catch {
        fetchData();
      }
    },
    [getRuleState, fetchData],
  );

  // Toggle column (all menus for an action in a role)
  const handleToggleColumn = useCallback(
    async (roleId: number, action: ActionType) => {
      const allChecked = menuList.every((m) =>
        getRuleState(roleId, m.key, action),
      );
      const newState = !allChecked;

      setRules((prev) => {
        const updated = [...prev];
        for (const menu of menuList) {
          const idx = updated.findIndex(
            (r) =>
              r.role_id === roleId && r.key === menu.key && r.action === action,
          );
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], state: newState };
          } else {
            updated.push({
              id: 0,
              role_id: roleId,
              key: menu.key,
              action,
              state: newState,
            });
          }
        }
        return updated;
      });

      try {
        await satellite.post("/api/rule/set", {
          data: menuList.map((menu) => ({
            role_id: roleId,
            key: menu.key,
            action,
            state: newState,
          })),
        });
      } catch {
        fetchData();
      }
    },
    [getRuleState, menuList, fetchData],
  );

  const toggleDivision = (id: number) => {
    setOpenDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRole = (id: number) => {
    setOpenRoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ─── Division CRUD ──────────────────────────────────────────────

  const handleCreateDivision = async () => {
    if (!divisionForm.name.trim()) return;
    setIsDivisionSubmitting(true);
    try {
      await satellite.post("/api/role/division/create", {
        name: divisionForm.name.trim(),
        description: divisionForm.description.trim(),
      });
      setDivisionDialogOpen(false);
      setDivisionForm({ name: "", description: "" });
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create division";
      alert(msg);
    } finally {
      setIsDivisionSubmitting(false);
    }
  };

  // ─── Role CRUD ────────────────────────────────────────────────

  const openAddRole = (divisionId: number) => {
    setRoleTargetDivisionId(divisionId);
    setRoleForm({ name: "", description: "" });
    setRoleDialogOpen(true);
  };

  const handleCreateRole = async () => {
    if (!roleForm.name.trim() || !roleTargetDivisionId) return;
    setIsRoleSubmitting(true);
    try {
      await satellite.post("/api/role/create", {
        role_division_id: roleTargetDivisionId,
        name: roleForm.name.trim(),
        description: roleForm.description.trim(),
      });
      setRoleDialogOpen(false);
      setRoleForm({ name: "", description: "" });
      setRoleTargetDivisionId(null);
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create role";
      alert(msg);
    } finally {
      setIsRoleSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {language({ id: "Peran & Hak Akses", en: "Roles & Permissions" })}
          </h1>
          <p className="mt-1 text-sm text-dark-400">
            {language({
              id: "Kelola peran dan hak akses menu pada sistem",
              en: "Manage roles and menu permissions in the system",
            })}
          </p>
        </div>
        <Button
          onClick={() => {
            setDivisionForm({ name: "", description: "" });
            setDivisionDialogOpen(true);
          }}
          className="gap-2"
        >
          <HiOutlinePlus size={16} />
          {language({ id: "Tambah Divisi", en: "Add Division" })}
        </Button>
      </div>

      {/* Division Accordions */}
      <div className="space-y-4">
        {divisions.map((division) => (
          <Card key={division.id}>
            {/* Division Header */}
            <CardHeader
              className="cursor-pointer select-none hover:bg-dark-700/30 transition-colors"
              onClick={() => toggleDivision(division.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-dark-400 transition-transform duration-200">
                    {openDivisions.has(division.id) ? (
                      <HiChevronDown size={18} />
                    ) : (
                      <HiChevronRight size={18} />
                    )}
                  </span>
                  <div>
                    <CardTitle className="text-base">{division.name}</CardTitle>
                    {division.description && (
                      <p className="text-xs text-dark-400 mt-0.5">
                        {division.description}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline">
                  {division.roles.length}{" "}
                  {language({ id: "peran", en: "roles" })}
                </Badge>
              </div>
            </CardHeader>

            {/* Division Content - Role Accordions */}
            {openDivisions.has(division.id) && (
              <CardContent className="space-y-3 pt-2">
                {/* Add Role Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddRole(division.id);
                    }}
                  >
                    <HiOutlinePlus size={14} />
                    {language({ id: "Tambah Peran", en: "Add Role" })}
                  </Button>
                </div>

                {division.roles.length === 0 ? (
                  <p className="text-sm text-dark-400 text-center py-4">
                    {language({
                      id: "Tidak ada peran dalam divisi ini",
                      en: "No roles in this division",
                    })}
                  </p>
                ) : (
                  division.roles.map((role) => (
                    <div
                      key={role.id}
                      className="border border-dark-600/40 rounded-xl overflow-hidden"
                    >
                      {/* Role Header */}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700/30 transition-colors text-left"
                        onClick={() => toggleRole(role.id)}
                      >
                        <span className="text-dark-400 transition-transform duration-200">
                          {openRoles.has(role.id) ? (
                            <HiChevronDown size={16} />
                          ) : (
                            <HiChevronRight size={16} />
                          )}
                        </span>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-sm text-foreground truncate">
                            {role.name}
                          </span>
                          {role.description && (
                            <span className="text-xs text-dark-400 truncate hidden sm:inline">
                              — {role.description}
                            </span>
                          )}
                        </div>
                        <Badge
                          variant={role.is_active ? "default" : "destructive"}
                        >
                          {role.is_active
                            ? language({ id: "Aktif", en: "Active" })
                            : language({ id: "Nonaktif", en: "Inactive" })}
                        </Badge>
                      </button>

                      {/* Role Content - Permission Grid */}
                      {openRoles.has(role.id) && (
                        <div className="border-t border-dark-600/40 px-4 py-3">
                          <div className="overflow-x-auto">
                            {/* Grid Header */}
                            <div
                              className="grid gap-2 min-w-[600px] items-center mb-2"
                              style={{
                                gridTemplateColumns:
                                  "minmax(140px, 1fr) repeat(5, 80px)",
                              }}
                            >
                              <div className="text-xs font-semibold text-dark-300 uppercase tracking-wider px-2">
                                {language({ id: "Menu", en: "Menu" })}
                              </div>
                              {ACTIONS.map((action) => {
                                const allChecked = menuList.every((m) =>
                                  getRuleState(role.id, m.key, action),
                                );
                                return (
                                  <div
                                    key={action}
                                    className="flex flex-col items-center gap-1"
                                  >
                                    <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
                                      {action}
                                    </span>
                                    <input
                                      type="checkbox"
                                      checked={allChecked}
                                      onChange={() =>
                                        handleToggleColumn(role.id, action)
                                      }
                                      disabled={!role.is_active}
                                      className="w-3.5 h-3.5 rounded border-dark-500 text-accent-500 focus:ring-accent-500/30 focus:ring-offset-0 bg-dark-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                      title={`Toggle all ${action}`}
                                    />
                                  </div>
                                );
                              })}
                            </div>

                            {/* Grid Rows */}
                            {menuList.map((menu) => {
                              const allChecked = ACTIONS.every((a) =>
                                getRuleState(role.id, menu.key, a),
                              );
                              return (
                                <div
                                  key={menu.key}
                                  className="grid gap-2 min-w-[600px] items-center py-1.5 border-t border-dark-600/20 hover:bg-dark-700/20 rounded transition-colors"
                                  style={{
                                    gridTemplateColumns:
                                      "minmax(140px, 1fr) repeat(5, 80px)",
                                  }}
                                >
                                  <div className="flex items-center gap-2 px-2">
                                    <input
                                      type="checkbox"
                                      checked={allChecked}
                                      onChange={() =>
                                        handleToggleRow(role.id, menu.key)
                                      }
                                      disabled={!role.is_active}
                                      className="w-3.5 h-3.5 rounded border-dark-500 text-accent-500 focus:ring-accent-500/30 focus:ring-offset-0 bg-dark-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    />
                                    <span className="text-sm text-foreground font-medium">
                                      {menu.label}
                                    </span>
                                  </div>
                                  {ACTIONS.map((action) => {
                                    const checked = getRuleState(
                                      role.id,
                                      menu.key,
                                      action,
                                    );
                                    const compositeKey = `${role.id}-${menu.key}-${action}`;
                                    const isUpdating =
                                      updatingKeys.has(compositeKey);
                                    return (
                                      <div
                                        key={action}
                                        className="flex justify-center"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() =>
                                            handleToggle(
                                              role.id,
                                              menu.key,
                                              action,
                                            )
                                          }
                                          disabled={
                                            !role.is_active || isUpdating
                                          }
                                          className="w-4 h-4 rounded border-dark-500 text-accent-500 focus:ring-accent-500/30 focus:ring-offset-0 bg-dark-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            )}
          </Card>
        ))}

        {divisions.length === 0 && (
          <Card>
            <CardContent>
              <p className="text-sm text-dark-400 text-center py-8">
                {language({
                  id: "Tidak ada divisi ditemukan",
                  en: "No divisions found",
                })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Add Division Dialog ──────────────────────────────── */}
      <Dialog open={divisionDialogOpen} onClose={() => {}}>
        <DialogContent onClose={() => setDivisionDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {language({ id: "Tambah Divisi", en: "Add Division" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {language({ id: "Nama Divisi", en: "Division Name" })}
              </Label>
              <Input
                value={divisionForm.name}
                onChange={(e) =>
                  setDivisionForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={language({
                  id: "Masukkan nama divisi",
                  en: "Enter division name",
                })}
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label>{language({ id: "Deskripsi", en: "Description" })}</Label>
              <Input
                value={divisionForm.description}
                onChange={(e) =>
                  setDivisionForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={language({
                  id: "Masukkan deskripsi (opsional)",
                  en: "Enter description (optional)",
                })}
                maxLength={255}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDivisionDialogOpen(false)}
            >
              {language({ id: "Batal", en: "Cancel" })}
            </Button>
            <Button
              onClick={handleCreateDivision}
              disabled={!divisionForm.name.trim() || isDivisionSubmitting}
            >
              {isDivisionSubmitting
                ? language({ id: "Menyimpan...", en: "Saving..." })
                : language({ id: "Simpan", en: "Save" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Role Dialog ──────────────────────────────────── */}
      <Dialog open={roleDialogOpen} onClose={() => {}}>
        <DialogContent onClose={() => setRoleDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {language({ id: "Tambah Peran", en: "Add Role" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language({ id: "Nama Peran", en: "Role Name" })}</Label>
              <Input
                value={roleForm.name}
                onChange={(e) =>
                  setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={language({
                  id: "Masukkan nama peran",
                  en: "Enter role name",
                })}
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label>{language({ id: "Deskripsi", en: "Description" })}</Label>
              <Input
                value={roleForm.description}
                onChange={(e) =>
                  setRoleForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={language({
                  id: "Masukkan deskripsi (opsional)",
                  en: "Enter description (optional)",
                })}
                maxLength={255}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              {language({ id: "Batal", en: "Cancel" })}
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={!roleForm.name.trim() || isRoleSubmitting}
            >
              {isRoleSubmitting
                ? language({ id: "Menyimpan...", en: "Saving..." })
                : language({ id: "Simpan", en: "Save" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
