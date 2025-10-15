import { create } from 'zustand';
type Role = 'customer'|'vendor'|'admin';
type User = { id:string; email:string; roles:Role[]; tenantId?:string };
export const useSession = create<{ user:User|null }>(() => ({ user: null }));