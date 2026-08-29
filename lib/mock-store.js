"use client";

export const SEED_VERSION = "2026-08-29-v1";

function nextId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createStore(key, initial) {
  let memory = [...initial];
  const subscribers = new Set();

  function notify() {
    subscribers.forEach((cb) => cb());
  }

  return {
    key,
    all() {
      return [...memory];
    },
    list(filter = {}, predicate, scope) {
      const { q = "", page = 1, pageSize = 10, sortBy, sortDir = "asc", ...fk } = filter;
      let rows = scope ? memory.filter(scope) : [...memory];

      for (const [k, v] of Object.entries(fk)) {
        if (v === undefined || v === null || v === "" || v === "all") continue;

        if (typeof v === "string" && k.endsWith("_from")) {
          const field = k.slice(0, -"_from".length);
          rows = rows.filter((r) => {
            const x = r[field];
            return typeof x === "string" && x.slice(0, 10) >= v;
          });
          continue;
        }
        if (typeof v === "string" && k.endsWith("_to")) {
          const field = k.slice(0, -"_to".length);
          rows = rows.filter((r) => {
            const x = r[field];
            return typeof x === "string" && x.slice(0, 10) <= v;
          });
          continue;
        }

        rows = rows.filter((r) => r[k] === v);
      }

      if (q && predicate) {
        const needle = q.toLowerCase().trim();
        rows = rows.filter((r) => predicate(r, needle));
      }

      if (sortBy) {
        rows.sort((a, b) => {
          const av = a[sortBy];
          const bv = b[sortBy];
          if (av === bv) return 0;
          if (av === undefined || av === null) return 1;
          if (bv === undefined || bv === null) return -1;
          return av > bv ? (sortDir === "asc" ? 1 : -1) : sortDir === "asc" ? -1 : 1;
        });
      } else {
        rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      }

      const total = rows.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const start = (page - 1) * pageSize;
      const slice = rows.slice(start, start + pageSize);

      return { results: slice, total, page, pageSize, totalPages };
    },
    get(id) {
      return memory.find((r) => r.id === id) ?? null;
    },
    create(input) {
      const now = new Date().toISOString();
      const row = { ...input, id: nextId(), created_at: now, updated_at: now };
      memory = [row, ...memory];
      notify();
      return row;
    },
    update(id, patch) {
      const idx = memory.findIndex((r) => r.id === id);
      if (idx < 0) throw new Error(`Record ${id} not found in ${key}`);
      const updated = { ...memory[idx], ...patch, updated_at: new Date().toISOString() };
      memory = [...memory.slice(0, idx), updated, ...memory.slice(idx + 1)];
      notify();
      return updated;
    },
    remove(id) {
      memory = memory.filter((r) => r.id !== id);
      notify();
    },
    reset(seed) {
      memory = seed ? [...seed] : [...initial];
      notify();
    },
    subscribe(cb) {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
  };
}
