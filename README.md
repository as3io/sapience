Sapience
========
Event tracking engine.
---

## Events: Action, Entity, User, and Context
- *What* was the _Action_ performed on (*Entity*)
- *Who* performed the _Action_ (*User*)
- *Where* was the _Action_ performed (*Context*),

### The Entity and User Namespace
Used for the *What* of the event, as well as the *Who*.
Provides a standardized way of namespacing and grouping entities. This methods was drawn from the [Zone, Base and Name: The Entity Namespace](http://senecajs.org/docs/tutorials/understanding-data-entities.html#zone-base-and-name-the-entity-namespace) concept found within SenecaJS.
```js
/**
 * The namespace object. Used by entity and user entries.
 * Property values only support alphanumeric + dash characters,
 * and will be converted if not properly formatted.
 */
{
  n: 'model-name', // Name: the primary name of the entity
  b: 'some-grouping', // Base: group name for entities that “belong together.”
  z: 'some-tenant', // Zone: name for a data set belonging to a business entity, geography, or customer.
}
// The stringified namespace would be: some-tenant/some-grouping/model-name.
// Empty (null, undefined, !str.length, etc), will be removed.
// Any empty values will be replaced with a `-` character within the stringified namespace.

/**
 * Represents the identifier and namespace for a Base Platform (Base4) Content entity.
 */
{
  id: '10124317', // A stringified entity identifier.
  ns: { n: 'content', b: 'base-platform' z: 'scomm-vspc' },
}

/**
 * Represents the identifier and namespace for a User,
 * In this case, an Omeda customer.
 */
{
  id: '1011762928', // A stringified user identifier.
  ns: { n: 'customer' b: 'omeda' z: 'vsp' },
}
```
#### Examples

### The Event Context
#### Examples

### Putting it all Together
```js
{
  act: 'view',
  ent: {
    id: '10124317',
    ns: { n: 'content', b: 'base-platform', z: 'scomm-vspc' },
  },
  user: {
    id: 'oidhf03yrhiwe',
    ns: { n: 'customer', b: 'omeda', z: 'vsp' },
  },
  ctxt: { }, // @todo Should this contain related entities? Custom key/values? Both?
}
```
---

## Tenant Structure
1. A user account is created.
2. An owning user account can create a new tenant (e.g. AC Business Media).
3. Owners can invite other users to manage the tenant.
4. Each tenant can have mutiple workspaces (e.g. For Construction Pros, Food Logistics, et cetera).
5. Data is then segmented per workspace using a safe stringified key.
7. Each workspace then esablishes (API) clients that can write to the database.
  - Each client has a potential format, such as "web," "native," etc.
---

## Root Endpoints / Routers
- Events `/events`
  - Requires a tenancy key
  - Tenant must allow the incoming resource location (e.g. CORs)
  - Handles writing events to the database
- Authentication `/auth`
  - Provides an SSO-like location for token handling
- REST API `/api`
  - Requires authentication for an account
  - Can add/remove tenants/applications for the account
  - For each tenant/application
    - Can view statistics, perform raw queries, manage entities, and view reports
    - Can setup click trackers and event beacons
- Health Check `/ping`
  - Open Endpoint
