import type { Team } from "../auth/types";

function emptyShell(email: string, inner: string): string {
  const admin = isSiteAdmin
    ? `<p><a href="/app/admin/teams">Teams admin</a></p>`
    : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}<p>${email}</p>${admin}<form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></main><script src="/teams.js"></script></body></html>`;
}

function teamShell(email: string, isSiteAdmin: boolean, inner: string): string {
  const admin = isSiteAdmin
    ? `<p><a href="/app/admin/teams">Teams admin</a></p>`
    : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}<p>${email}</p>${admin}<form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></main><script src="/teams.js"></script></body></html>`;
}

function pickerShell(email: string, isSiteAdmin: boolean, inner: string): string {
  const admin = "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}${admin}</main><script src="/teams.js"></script></body></html>`;
}

function adminShell(email: string, inner: string): string {
  const admin = "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}${admin}</main><script src="/teams.js"></script></body></html>`;
}

export function noTeamsAdminHtml(email: string): string {
  return emptyShell(email, `<form method="post" action="/api/teams" id="create-team"><label for="team-name">Team name</label><input id="team-name" name="name" required /><button type="submit">Create team</button></form>`);
}

export function pickerHtml(
  email: string,
  isSiteAdmin: boolean,
  teams: Team[],
): string {
  return pickerShell(email, isSiteAdmin, `<h1>Your teams</h1>${teams.slice(0, 1).map((t) => `<p><a href="/app/teams/${t.id}">${t.name}</a></p>`).join("")}`);
}

export function teamPageHtml(
  email: string,
  isSiteAdmin: boolean,
  team: Team,
): string {
  return teamShell(email, isSiteAdmin, `<h1>${team.name}</h1>`);
}

export function adminTeamsHtml(email: string, teams: Team[]): string {
  const invites = "";
  return adminShell(email, invites);
}
