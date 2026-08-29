export function stashNavId(id) {
  try {
    window.sessionStorage.setItem("re-erp:nav-entity-id", id);
  } catch {}
}

export function readNavId() {
  try {
    return window.sessionStorage.getItem("re-erp:nav-entity-id");
  } catch {
    return null;
  }
}
