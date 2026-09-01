import type { EventModelRow, Team } from "../auth/types";

function shell(
  email: string,
  isSiteAdmin: boolean,
  inner: string,
  extras: { head?: string; lead?: string; bodyClass?: string } = {},
): string {
  const admin = isSiteAdmin
    ? `<p><a href="/app/admin/teams">Teams admin</a></p>`
    : "";
  const bodyClass = extras.bodyClass ? ` class="${extras.bodyClass}"` : "";
  const head = extras.head ?? "";
  const lead = extras.lead ?? `<a href="/app">Event Model</a>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body${bodyClass}><header>${lead}<div class="appbar-end"><nav></nav><p>${email}</p><form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></div></header><main>${inner}${admin}</main><script src="/teams.js"></script></body></html>`;
}

export function noTeamsAdminHtml(email: string): string {
  return shell(
    email,
    true,
    `<form method="post" action="/api/teams" id="create-team"><label for="team-name">Team name</label><input id="team-name" name="name" required /><button type="submit">Create team</button></form>`,
    { head: `<link rel="stylesheet" href="/shell.css">`, bodyClass: "app-none" },
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
  return shell(
    email,
    isSiteAdmin,
    `<h1>Your teams</h1>${links}`,
    { head: `<link rel="stylesheet" href="/shell.css">`, bodyClass: "app-picker" },
  );
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
    { head: `<link rel="stylesheet" href="/shell.css">`, bodyClass: "app-team" },
  );
}

export function modelPageHtml(
  email: string,
  title: string,
  modelId: string,
  version: number,
  teamName: string,
  slices: Array<{
    title: string;
    actors?: Array<{ name: string }>;
    commands?: Array<{ title: string }>;
    events?: Array<{ title: string }>;
    readModels?: Array<{ title: string }>;
    processors?: Array<{ title: string }>;
  }> = [],
  documentJson = "",
  connections: Array<{ fromKind: string; toKind: string }> = [],
): string {
  const items = slices
    .map(
      (slice) =>
        `<li aria-label="${slice.title}">${slice.title}</li>`,
    )
    .join("");
  const sliceColumns = slices
    .map((slice, index) => {
      const actors = (slice.actors ?? [])
        .map(
          (actor) =>
            `<li aria-label="${actor.name}" data-kind="actor">${actor.name}</li>`,
        )
        .join("");
      const commands = (slice.commands ?? [])
        .map(
          (command) =>
            `<li aria-label="${command.title}" data-kind="command">${command.title}</li>`,
        )
        .join("");
      const events = (slice.events ?? [])
        .map(
          (event) =>
            `<li aria-label="${event.title}" data-kind="event">${event.title}</li>`,
        )
        .join("");
      const readModels = (slice.readModels ?? [])
        .map(
          (readModel) =>
            `<li aria-label="${readModel.title}" data-kind="readmodel">${readModel.title}</li>`,
        )
        .join("");
      const automations = (slice.processors ?? [])
        .map(
          (automation) =>
            `<li aria-label="${automation.title}" data-kind="automation">${automation.title}</li>`,
        )
        .join("");
      return `<div class="slice-col" data-slice-index="${index}"><div class="slice-head">${slice.title}</div><div class="lane" data-lane="actor"><ul>${actors}</ul></div><div class="lane" data-lane="command"><ul>${commands}</ul></div><div class="lane" data-lane="event"><ul>${events}</ul></div><div class="lane" data-lane="readmodel"><ul>${readModels}</ul></div><div class="lane" data-lane="automation"><ul>${automations}</ul></div></div>`;
    })
    .join("");
  const connectionCopy = [
    ...connections
      .filter(
        (connection) =>
          connection.fromKind === "COMMAND" && connection.toKind === "EVENT",
      )
      .map(() => '<p data-kind="connection">Command → Event Happened</p>'),
    ...connections
      .filter(
        (connection) =>
          connection.fromKind === "EVENT" && connection.toKind === "READMODEL",
      )
      .map(() => '<p data-kind="connection">Event Happened → Read Model</p>'),
  ].join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/shell.css"></head><body class="app-editor"><header><div class="editor-brand"><p>${teamName}</p><h1>${title}</h1></div><div class="editor-actions"><button type="button">Zoom in</button><button type="button">Zoom out</button><button type="button">Reset zoom</button><form id="save-model" method="post" action="/api/models/${modelId}"><input type="hidden" name="version" value="${version}" /><button type="submit">Save</button></form><form id="export-model" method="get" action="/api/models/${modelId}/export"><button type="submit">Export</button></form><p>${email}</p><form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></div></header><div class="editor-toolbar"><button type="button">New Slice</button><button type="button">Add Actor</button><button type="button">Add Command</button><button type="button">Add Event</button><button type="button">Add Read Model</button><button type="button">Add Automation</button></div><main><div class="slice-rail"><h2>Model</h2><p class="model-row">${title}</p><h2>Slices</h2><ul>${items}</ul></div><section aria-label="Timeline"><div class="time-chrome"><span>Time</span><span class="time-rule"></span></div><div class="timeline-empty"><h2>Start the timeline</h2><p>A slice is one vertical feature: an actor, a command, the events it writes, the read models those events feed, and any automation that follows.</p></div><div class="board"><div class="lane-rail" aria-hidden="true"><div class="lane-label">Slice</div><div class="lane-label actor">Actor</div><div class="lane-label command">Command</div><div class="lane-label event">Event</div><div class="lane-label readmodel">Read Model</div><div class="lane-label automation">Automation</div></div>${sliceColumns}</div>${connectionCopy}</section><section aria-label="Inspector"><h2>Inspector</h2><p class="inspector-empty">Nothing Selected</p><p class="inspector-empty-hint">Select a slice or building block on the canvas.</p></section></main><script type="application/json" id="event-model-document">${documentJson}</script><script src="/teams.js"></script><script type="module" src="/editor.js"></script></body></html>`;
}

export function adminTeamsHtml(email: string, teams: Team[]): string {
  const invites = teams
    .map(
      (t) =>
        `<section><h1>${t.name}</h1><form class="invite" method="post" action="/api/teams/${t.id}/invites"><label for="invite-${t.id}">Invite email</label><input id="invite-${t.id}" name="email" type="email" required /><button type="submit">Send invite</button></form></section>`,
    )
    .join("");
  return shell(
    email,
    false,
    invites,
    { head: `<link rel="stylesheet" href="/shell.css">`, bodyClass: "app-admin" },
  );
}
