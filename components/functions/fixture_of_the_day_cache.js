import { useSyncExternalStore } from "react";

const memoryCache = new Map();
const listeners = new Set();

function storageKey(date) {
  return `fixture-of-day:${date}`;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getFixtureOfTheDayCache(date) {
  if (!date) return null;

  if (memoryCache.has(date)) {
    return memoryCache.get(date);
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(storageKey(date));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    memoryCache.set(date, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export function setFixtureOfTheDayCache(date, payload) {
  if (!date) return;

  memoryCache.set(date, payload);

  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(storageKey(date), JSON.stringify(payload));
  } catch {
    // Ignore quota errors.
  }

  emitChange();
}

/**
 * Returns cached fixture data with a server snapshot of null so SSR and the
 * initial hydration render always match (skeleton UI), then reads sessionStorage.
 */
export function useFixtureOfTheDayCache(date) {
  return useSyncExternalStore(
    subscribe,
    () => getFixtureOfTheDayCache(date),
    () => null
  );
}
