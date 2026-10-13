import type { Project } from '../types';
import { pushProject, removeProjectRemote } from './serverSync';

const STORAGE_KEY = 'website-builder-projects';

function readAll(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function saveProject(project: Project): void {
  const projects = readAll();
  projects.push(project);
  writeAll(projects);
  void pushProject(project);
}

export function getProjects(): Project[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getProject(id: string): Project | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function deleteProject(id: string): void {
  const projects = readAll().filter((p) => p.id !== id);
  writeAll(projects);
  void removeProjectRemote(id);
}

export function updateProject(project: Project): void {
  const projects = readAll();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx === -1) return;
  const next = { ...project, updatedAt: Date.now() };
  projects[idx] = next;
  writeAll(projects);
  void pushProject(next);
}

/** Merges projects fetched from the server into local storage. */
export function mergeRemoteProjects(remote: Project[]): void {
  if (!Array.isArray(remote) || remote.length === 0) return;
  const local = readAll();
  const byId = new Map(local.map((p) => [p.id, p]));
  for (const rp of remote) {
    if (!rp?.id || !rp?.config) continue;
    const existing = byId.get(rp.id);
    if (!existing || rp.updatedAt > existing.updatedAt) {
      byId.set(rp.id, rp);
    }
  }
  writeAll([...byId.values()]);
}