import type { EventModelRow, Team } from "../auth/types";

function shell(
  email: string,
  isSiteAdmin: boolean,
  inner: string,
  extras: { head?: string; lead?: string; bodyClass?: string } = {},
): string {
  const admin = isSiteAdmin
    ? `<a href="/app/admin/teams">Teams admin</a>`
    : "";
  const bodyClass = extras.bodyClass ? ` class="${extras.bodyClass}"` : "";
  const head = extras.head ?? "";
  const lead = extras.lead ?? `<a href="/app"><img src="/favicon.png" alt="">Event Model</a>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body${bodyClass}><header>${lead}<div class="appbar-end"><nav>${admin}</nav><p>${email}</p><form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></div></header><main>${inner}</main><script src="/teams.js"></script></body></html>`;
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
        `<article><a href="/app/teams/${team.id}/models/${m.id}">${m.title}</a></article>`,
    )
    .join("");
  const empty =
    models.length === 0
      ? `<p>Create a model to start the timeline.</p>`
      : "";
  return shell(
    email,
    isSiteAdmin,
    `<h1>${team.name}</h1><div class="models-toolbar"><h2>Event Models</h2><form id="create-model" method="post" action="/api/teams/${team.id}/models"><button type="submit">Create model</button></form></div>${empty}${links}`,
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
    id?: string;
    title: string;
    actors?: Array<{ id?: string; name: string }>;
    commands?: Array<{ id?: string; title: string }>;
    events?: Array<{ id?: string; title: string }>;
    readModels?: Array<{ id?: string; title: string }>;
    processors?: Array<{ id?: string; title: string }>;
  }> = [],
  documentJson = "",
  connections: Array<{ id?: string; fromKind: string; toKind: string }> = [],
  isSiteAdmin = false,
  teamId = "",
): string {
  const items = slices
    .map(
      (slice) =>
        `<li aria-label="${slice.title}"${slice.id ? ` data-id="${slice.id}"` : ""}>${slice.title}</li>`,
    )
    .join("");
  const sliceColumns = slices
    .map((slice, index) => {
      const actors = (slice.actors ?? [])
        .map((actor) => {
          const id = actor.id ? ` data-id="${actor.id}"` : "";
          return `<li aria-label="${actor.name}" data-kind="actor"${id}>${actor.name}</li>`;
        })
        .join("");
      const commands = (slice.commands ?? [])
        .map((command) => {
          const id = command.id
            ? ` data-id="${command.id}"`
            : "";
          return `<li aria-label="${command.title}" data-kind="command"${id}>${command.title}<button type="button"${id}${command.id ? ` data-kind="COMMAND"` : ""}>Command port</button></li>`;
        })
        .join("");
      const events = (slice.events ?? [])
        .map((event) => {
          const id = event.id ? ` data-id="${event.id}"` : "";
          return `<li aria-label="${event.title}" data-kind="event"${id}>${event.title}<button type="button"${id}${event.id ? ` data-kind="EVENT"` : ""}>Event Happened port</button></li>`;
        })
        .join("");
      const readModels = (slice.readModels ?? [])
        .map((readModel) => {
          const id = readModel.id ? ` data-id="${readModel.id}"` : "";
          return `<li aria-label="${readModel.title}" data-kind="readmodel"${id}>${readModel.title}<button type="button"${id}${readModel.id ? ` data-kind="READMODEL"` : ""}>Read Model port</button></li>`;
        })
        .join("");
      const automations = (slice.processors ?? [])
        .map((automation) => {
          const id = automation.id ? ` data-id="${automation.id}"` : "";
          return `<li aria-label="${automation.title}" data-kind="automation"${id}>${automation.title}</li>`;
        })
        .join("");
      return `<div class="slice-col" data-slice-index="${index}"><ul class="slice-head"><li aria-label="${slice.title}"${slice.id ? ` data-id="${slice.id}"` : ""}>${slice.title}</li></ul><div class="lane" data-lane="actor"><ul>${actors}</ul><button type="button" data-slice-index="${index}">Add Actor on lane</button></div><div class="lane" data-lane="command"><ul>${commands}</ul><button type="button" data-slice-index="${index}">Add Command on lane</button></div><div class="lane" data-lane="event"><ul>${events}</ul><button type="button" data-slice-index="${index}">Add Event on lane</button></div><div class="lane" data-lane="readmodel"><ul>${readModels}</ul><button type="button" data-slice-index="${index}">Add Read Model on lane</button></div><div class="lane" data-lane="automation"><ul>${automations}</ul><button type="button" data-slice-index="${index}">Add Automation on lane</button></div></div>`;
    })
    .join("");
  const connectionCopy = [
    ...connections
      .filter(
        (connection) =>
          connection.fromKind === "COMMAND" && connection.toKind === "EVENT",
      )
      .map((connection) => {
        const id = connection.id ? ` data-id="${connection.id}"` : "";
        return `<p data-kind="connection"${id}>Command → Event Happened</p>`;
      }),
    ...connections
      .filter(
        (connection) =>
          connection.fromKind === "EVENT" && connection.toKind === "READMODEL",
      )
      .map((connection) => {
        const id = connection.id ? ` data-id="${connection.id}"` : "";
        return `<p data-kind="connection"${id}>Event Happened → Read Model</p>`;
      }),
  ].join("");
  const admin = isSiteAdmin
    ? `<a href="/app/admin/teams">Teams admin</a>`
    : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/shell.css"></head><body class="app-editor"><header><a href="/app"><img src="/favicon.png" alt="">Event Model</a><div class="editor-brand"><p><a href="/app/teams/${teamId}">${teamName}</a></p><h1>${title}</h1></div><div class="editor-actions"><nav>${admin}</nav><button type="button">Zoom in</button><button type="button">Zoom out</button><button type="button">Reset zoom</button><form id="save-model" method="post" action="/api/models/${modelId}"><input type="hidden" name="version" value="${version}" /><button type="submit">Save</button></form><form id="export-model" method="get" action="/api/models/${modelId}/export"><button type="submit">Export</button></form><p>${email}</p><form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></div></header><div class="editor-toolbar"><button type="button">New Slice</button><button type="button">Add Actor</button><button type="button">Add Command</button><button type="button">Add Event</button><button type="button">Add Read Model</button><button type="button">Add Automation</button></div><main><div class="slice-rail"><h2>Model</h2><p class="model-row">${title}</p><h2>Slices</h2><ul>${items}</ul></div><section aria-label="Timeline"><div class="time-chrome"><span>Time</span><span class="time-rule"></span></div><div class="timeline-empty"><h2>Start the timeline</h2><p>A slice is one vertical feature: an actor, a command, the events it writes, the read models those events feed, and any automation that follows.</p></div><div class="board"><div class="lane-rail" aria-hidden="true"><div class="lane-label">Slice</div><div class="lane-label actor">Actor</div><div class="lane-label command">Command</div><div class="lane-label event">Event</div><div class="lane-label readmodel">Read Model</div><div class="lane-label automation">Automation</div></div>${sliceColumns}${connectionCopy}</div></section><section aria-label="Inspector"><h2>Inspector</h2><p class="inspector-empty">Nothing Selected</p><p class="inspector-empty-hint">Select a slice or building block on the canvas.</p></section></main><script type="application/json" id="event-model-document">${documentJson}</script><script src="/teams.js"></script><script type="module" src="/editor.js"></script></body></html>`;
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
    true,
    invites,
    { head: `<link rel="stylesheet" href="/shell.css">`, bodyClass: "app-admin" },
  );
}
