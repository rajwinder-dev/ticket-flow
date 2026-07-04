export function getOrgIdFromUrl() {
  if(typeof window === "undefined") return;
  const match = window.location.pathname.match(/org\/([^/]+)/);
  return match?.[1];
}
