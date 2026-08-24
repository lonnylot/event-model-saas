# Event Model SaaS

Hosted Event Modeling at [event-model.lonnylot.com](https://event-model.lonnylot.com).

This is the SaaS successor to the native Mac app [EventModel](https://github.com/lonnylot/EventModel): same `.eventmodel` document language (slices, actors, commands, events, read models, automations, connections), plus sign-in, teams, and more than one person on a model.

## Agent workflow

This repo uses [spec-loop](https://github.com/lonnylot/spec-loop). Start at [`AGENTS.md`](./AGENTS.md) and [`CONTEXT.md`](./CONTEXT.md). Specs live in [`docs/specs/`](./docs/specs/).

```
NO BEHAVIOR WITHOUT A SPEC.
```

## Source document

The Mac app’s JSON Schema is the current document contract: [`schemas/eventmodel.schema.json`](https://github.com/lonnylot/EventModel/blob/main/schemas/eventmodel.schema.json).
