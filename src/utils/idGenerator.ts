/**
 * Centralized unique ID generation for portfolio list items.
 * Uses a monotonic counter to prevent collisions on rapid successive calls.
 */

type IdPrefix = "exp" | "edu" | "proj";

let counter = 0;

export function generateId(prefix: IdPrefix, index?: number): string {
  const base = `${prefix}-${Date.now()}-${counter++}`;
  return index !== undefined ? `${base}-${index}` : base;
}
