Sapience
========
Event tracking engine.
---

## Event: Action, Entity, Identity, and Source
What was performed (Action), Who performed it (Identity), Where was it performed (Source),
[Zone, Base and Name: The Entity Namespace](http://senecajs.org/docs/tutorials/understanding-data-entities.html#zone-base-and-name-the-entity-namespace)

May need additional context data.
For example, ads can be requested with a key/value pair context of custom variables.

### Examples
Tenant: Vehicle Service Pros

```js
{
  a: 'view',
  e: {
    id: '10124317',
    ns: { // 5b
      // Values for each should only support alphanumeric + dash characters.
      n: 'content', // The primary name of the entity
      b: 'base-platform', // Group name for entities that “belong together.”
      z: 'scomm-vspc', // Name for a data set belonging to a business entity, geography, or customer.
    },
    cx: {

    }
  },
  u: {
    id: 'oidhf03yrhiwe',
    ns: { // 21b
      n: 'customer',
      b: 'omeda',
      z: 'vsp',
    },
  },
  s: {

  },
}
// VSP in Base3/Merrick
{
  id: '10124317',
  namespace: {
    // Values for each should only support alphanumeric + dash characters.
    name: 'content', // The primary name of the entity
    base: 'merrick', // Group name for entities that “belong together.”
    zone: 'cygnus-vspc', // Name for a data set belonging to a business entity, geography, or customer.
  }
}
// VSP in Base4
{
  id: '10124317',
  namespace: {
    // Values for each should only support alphanumeric + dash characters.
    name: 'content', // The primary name of the entity
    base: 'base-platform', // Group name for entities that “belong together.”
    zone: 'scomm-vspc', // Name for a data set belonging to a business entity, geography, or customer.
  }
}
```

## Tenant Structure
Similar to Auth0, with a "touch" of Google Analytics.
1. A user account is created.
2. An owning user account can create a new tenant (e.g. AC Business Media).
3. Owners can invite other users to manage the tenant.
4. Each tenant can have mutiple workspaces, with an application (e.g. ForConstructionPros [Website])
5. Data is then segmented per workspace (or per application?).
Hierachy:
Tenant -> Workspace -> Application (Users live at the Tenant level)
Compared to GA: Account -> Property -> View
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
