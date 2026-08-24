# Event Model SaaS

A hosted Event Modeling canvas. Authenticated teams own models together and edit one Event Model as a group.

The document language comes from the native Mac app [EventModel](https://github.com/lonnylot/EventModel) and [Event Modeling](https://eventmodeling.org/) (Adam Dymitruk). SaaS terms (Team, Person, membership) will be sharpened as those specs land.

## Language

**Event Model**:
A blueprint document: a horizontal timeline of slices plus connections. Stored as `.eventmodel` JSON (`format: "eventmodel"`).
_Avoid_: diagram, board, canvas file, project

**Slice**:
One vertical column on the timeline. It has a type (`STATE_CHANGE`, `STATE_VIEW`, or `AUTOMATION`) and holds actors, commands, events, read models, and automations.
_Avoid_: column, step, swimlane

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

**Team**:
A named group of people who can share Event Models. Membership and roles are not specified yet.
_Avoid_: org, organization, workspace, account (until a spec picks one)

**Person**:
Someone who signs in. Not the same as Actor (an Actor is a block on the canvas).
_Avoid_: user (until a spec picks Person vs User), member (membership is a relationship, not the person)
