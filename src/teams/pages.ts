import type { EventModelRow, Team } from "../auth/types";

function shell(email: string, isSiteAdmin: boolean, inner: string): string {
  const admin = isSiteAdmin
    ? `<p><a href="/app/admin/teams">Teams admin</a></p>`
    : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main>${inner}<p>${email}</p>${admin}<form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></main><script src="/teams.js"></script></body></html>`;
}

export function noTeamsAdminHtml(email: string): string {
  return shell(
    email,
    true,
    `<form method="post" action="/api/teams" id="create-team"><label for="team-name">Team name</label><input id="team-name" name="name" required /><button type="submit">Create team</button></form>`,
  );
}

export function pickerHtml(
  email: string,
  isSiteAdmin: boolean,
  teams: Team[],
): string {
  const links = teams
    .map((t) => `<p><a href="/app/teams/${t.id}">${t.name}</a></p>`)
    .join("");
  return shell(email, isSiteAdmin, `<h1>Your teams</h1>${links}`);
}

export function teamPageHtml(
  email: string,
  isSiteAdmin: boolean,
  team: Team,
  models: EventModelRow[] = [],
): string {
  const links = models
    .map(
      (m) =>
        `<p><a href="/app/teams/${team.id}/models/${m.id}">${m.title}</a></p>`,
    )
    .join("");
  return shell(
    email,
    isSiteAdmin,
    `<h1>${team.name}</h1><form id="create-model" method="post" action="/api/teams/${team.id}/models"><button type="submit">Create model</button></form>${links}`,
  );
}

export function modelPageHtml(
  email: string,
  title: string,
  modelId: string,
): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><main><h1>${title}</h1><form id="save-model" method="post" action="/api/models/${modelId}"><button type="submit">Save</button></form><form id="export-model" method="get" action="/api/models/${modelId}/export"><button type="submit">Export</button></form><p>${email}</p><form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></main></body></html>`;
}

export function adminTeamsHtml(email: string, teams: Team[]): string {
  const invites = teams
    .map(
      (t) =>
        `<section><h1>${t.name}</h1><form class="invite" method="post" action="/api/teams/${t.id}/invites"><label for="invite-${t.id}">Invite email</label><input id="invite-${t.id}" name="email" type="email" required /><button type="submit">Send invite</button></form></section>`,
    )
    .join("");
  return shell(email, false, invites);
}


