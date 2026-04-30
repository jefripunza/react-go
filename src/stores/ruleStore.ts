import { create } from "zustand";

export interface Rule {
  id: number;
  role_id: number;
  key: string;
  action: string;
  state: boolean;
}

interface RuleState {
  role_selected: number | null;
  setRoleSelected: (role_selected: number | null) => void;
  rules: Rule[];
  setRules: (rules: Rule[]) => void;
}

export const useRuleStore = create<RuleState>()((set) => ({
  role_selected: localStorage.getItem("role_selected")
    ? parseInt(localStorage.getItem("role_selected")!)
    : null,
  setRoleSelected: (role_selected: number | null) => set({ role_selected }),
  rules: [],
  setRules: (rules: Rule[]) => set({ rules }),
}));
