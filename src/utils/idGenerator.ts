/**
 * Centralized unique ID generation for portfolio list items.
 */

type IdPrefix = "exp" | "edu" | "proj";

export function generateId(prefix: IdPrefix, index?: number): string {
  const base = `${prefix}-${Date.now()}`;
  return index !== undefined ? `${base}-${index}` : base;
}
