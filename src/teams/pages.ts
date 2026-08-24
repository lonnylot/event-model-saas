import type { Team } from "../auth/types";

function emptyShell(email: string, inner: string): string {
  const admin = "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}<p>${email}</p>${admin}</main><script src="/teams.js"></script></body></html>`;
}

function teamShell(email: string, isSiteAdmin: boolean, inner: string): string {
  const admin = "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}${admin}</main><script src="/teams.js"></script></body></html>`;
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
  return emptyShell(email, `<form method="post" action="/api/teams" id="create-team"><label for="team-name">Team name</label><input id="team-name" name="name" required /></form>`);
}

export function pickerHtml(
  email: string,
  isSiteAdmin: boolean,
  teams: Team[],
): string {
  return pickerShell(email, isSiteAdmin, ``);
}

export function teamPageHtml(
  email: string,
  isSiteAdmin: boolean,
  team: Team,
): string {
  return teamShell(email, isSiteAdmin, ``);
}

export function adminTeamsHtml(email: string, teams: Team[]): string {
  const invites = "";
  return adminShell(email, invites);
}
