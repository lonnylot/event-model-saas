# Event Model SaaS

A hosted Event Modeling canvas. Invite-only people sign in with a magic link, belong to teams the site admin creates, and edit one Event Model as a group with version-checked saves.

The document language comes from the native Mac app [EventModel](https://github.com/lonnylot/EventModel) and [Event Modeling](https://eventmodeling.org/) (Adam Dymitruk).

## Language

**Event Model**:
A blueprint document: a horizontal timeline of slices plus connections. Stored as `.eventmodel` JSON (`format: "eventmodel"`).
_Avoid_: diagram, board, canvas file, project

**Slice**:
One vertical column on the timeline. It has a type (`STATE_CHANGE`, `STATE_VIEW`, or `AUTOMATION`) and holds actors, commands, events, read models, and automations.
_Avoid_: column, step, swimlane

**Slice type**:
The Slice `sliceType` value: `STATE_CHANGE`, `STATE_VIEW`, or `AUTOMATION`. Inspector labels are State Change, State View, and Automation.
_Avoid_: kind (for this), category, slice kind

**Actor**:
A person or system that issues a command in a slice.
_Avoid_: user (for this role), persona, role

**Command**:
An intent an actor issues. Legal connection: command → event.
_Avoid_: action, request (as the block type)

**Event**:
A fact that happened. Legal connections: command → event, event → read model.
_Avoid_: message, notification (as the block type)

**Read Model**:
A view of state derived from events. Legal connection: event → read model.
_Avoid_: query, projection (as the on-canvas block name)

**Automation**:
A processor that reacts without a human actor. The JSON field is `processors`; the UI label is Automation.
_Avoid_: processor (as the visible label), saga, policy

**Connection**:
A directed edge `fromID`/`fromKind` → `toID`/`toKind`. Legal kinds are `COMMAND`, `EVENT`, `READMODEL`. Legal edges are command → event and event → read model.
_Avoid_: arrow, link, wire

**Field**:
A named typed property on a command, event, read model, or automation (`String`, `Boolean`, `Int`, `Long`, `Double`, `Decimal`, `Date`, `DateTime`, `UUID`, `Custom`).
_Avoid_: attribute, property (as the schema name)

**Description**:
Free-text on an Event Model, Slice, Actor, Command, Event, Read Model, or Automation. It is not a Field.
_Avoid_: notes, blurb, body (as the inspector label)

**Team**:
A named group created only by the site admin. Every Event Model belongs to exactly one Team. Every Person on the Team may edit every Event Model on that Team.
_Avoid_: org, organization, workspace, account

**Person**:
Someone who can sign in. Created by an Invite, or by the first login of `SITE_ADMIN_EMAIL`. Not the same as Actor (an Actor is a block on the canvas).
_Avoid_: user, member (membership is a relationship, not the person)

**Site admin**:
The Person whose email is `SITE_ADMIN_EMAIL`. They create Teams and send Invites. They may sign in without an Invite.
_Avoid_: owner, superuser, operator (as the role name)

**Invite**:
An email asking a Person to join one Team. If that Person does not exist, the Invite creates them. It is not a login session.
_Avoid_: invite link (the magic link is a separate login token), share

**Membership**:
The relationship that a Person has to a Team. It is not the Person.
_Avoid_: member (as a type name), role, seat

**Magic link**:
A one-time, time-limited token emailed to a Person so they can start a Session. It is not an Invite.
_Avoid_: invite link, login link (as the type name)

**Session**:
The httpOnly cookie created when a Person consumes a magic link. It is not membership.
_Avoid_: login, token (as the product word)

**Version**:
The integer on Event Model metadata that Save must match. It is not a history of old documents.
_Avoid_: revision, etag, lock

**Waitlist**:
A stored email of someone who asked to be invited. It is not a Person, Invite, Session, or signup.
_Avoid_: signup, lead, subscriber
