/**
 * Generic CRUD helpers for arrays of items identified by an `id` field.
 * Eliminates repeated add/update/remove logic across experience, education, and projects.
 */

interface Identifiable {
  id: string;
}

export function addItem<T extends Identifiable>(list: T[], newItem: T): T[] {
  return [...list, newItem];
}

export function updateItem<T extends Identifiable>(
  list: T[],
  id: string,
  field: keyof T,
  value: T[keyof T]
): T[] {
  return list.map((item) =>
    item.id === id ? { ...item, [field]: value } : item
  );
}

export function removeItem<T extends Identifiable>(list: T[], id: string): T[] {
  return list.filter((item) => item.id !== id);
}
