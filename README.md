# Sapience

## Events: Date, Action, Entity, User, Context, and Source
- **Who** performed the _Action_ (**User**)
- **What** was the _Action_ performed on (**Entity**)
- **Where** was the _Action_ performed (**Context**)
- **When** the _Action_ was perfomed (**Date**)
- **Why** was the _Action_ performed (**Source**)
- **How** was it performed (**Action**)

### The Entity and User Namespace
Used for the **What** of the event, as well as the **Who**.
Provides a standardized way of namespacing and grouping entities. This methods was drawn from the [Zone, Base and Name: The Entity Namespace](http://senecajs.org/docs/tutorials/understanding-data-entities.html#zone-base-and-name-the-entity-namespace) concept found within SenecaJS.
```js
/**
 * The namespace object. Used by entity and user entries.
 * Property values only support alphanumeric + dash characters,
 * and will be converted if not properly formatted.
 */
{
  z: 'some-tenant', // Zone: name for a data set belonging to a business entity, geography, or customer.
  b: 'some-grouping', // Base: group name for entities that “belong together.”
  n: 'model-name', // Name: the primary name of the entity
}
// As a stringified namespace: some-tenant.some-grouping.model-name.
// Empty (null, undefined, !str.length, etc), will be removed.
// Any empty values will be replaced with a `-` character within the stringified namespace.
// Note: this makes the . character illegal in namespaces.

/**
 * Represents the identifier and namespace for a Base Platform (Base4) Content entity.
 */
{
  id: '10124317', // A stringified entity identifier.
  ns: { n: 'content', b: 'base-platform' z: 'scomm-vspc' },
}
// As a stringified entity: 10124317*scomm-vspc.base-platform.content
// With fallback identifiers: 10124317!xyzDF*scomm-vspc.base-platform.content
// Note - this makes the * and ! characters illegal in identifiers and namespaces.
// 10124317*content.base-platform.scomm-vspc (41 characters) vs. 10124317*content%2Fbase-platform%2Fscomm-vspc (45 characters)

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
#### Sample POST Request
`POST /events/{action}.{ext}`
```json
{
	"ent": {
		"id": 10124317,
		"ns": {
			"z": "cygnus-vspc",
			"b": "base-platform",
			"n": "content"
		}
	},
	"usr": {
		"id": "50dc692d577b31d06d000007",
		"ns": {
			"z": "vsp",
			"b": "merrick",
			"n": "user"
		}
  },
  "ctx": {}, // @todo Should this contain related entities? Custom key/values? Both?
  "src": {}
}
```
Multiple entities can be sent by sending the `ent` value as an array of entity values. For example:
```json
{
	"ent": [
    { "id": 10124317, "ns": { "z": "cygnus-vspc", "b": "base-platform", "n": "content" } },
    { "id": 4563, "ns": { "z": "cygnus-vspc", "b": "base-platform", "n": "taxonomy" } },
  ]
}
```
#### Sample GET Request
`GET /events/{action}.{ext}/?ent[id]=10124317&ent[ns]=cygnus-vspc/base-platform/content&usr[id]=50dc692d577b31d06d000007&usr[ns]=vsp/merrick/user`
As with POST requests, multple entities can be sent using the `ent[i][key]` query parameter format, such as:
`ent[0][id]=10124317&ent[0][ns]=cygnus-vspc/base-platform/content&ent[1][id]=4563&ent[1][ns]=cygnus-vspc/base-platform/taxonomy`
---

## Tenant Structure
1. A user account is created.
2. An owning user account can create a new tenant (e.g. AC Business Media).
3. Owners can invite other users to manage the tenant.
4. Each tenant can have mutiple workspaces (e.g. For Construction Pros, Food Logistics, et cetera).
5. Data is then segmented per workspace using a safe stringified key.
7. Each workspace then esablishes (API) clients that can write to the database.
  - Each client has a potential format, such as "web," "native," etc.

### Model Examples
```js
// TENANT
{
  _id: ObjectId("5a04c2a43b92e9ec9e55c690"),
  name: 'AC Business Media',
  key: 'acbm', // alphanumeric with dashes, max length of 26, unique, cannot be empty
}
// WORKSPACE
{
  _id: ObjectId("5a04c2c82e34dd04082fc413"),
  name: 'For Construction Pros',
  key: 'fcp', // alphanumeric with dashes, max length of 26, unique per tenant, cannot be empty
  tenant: ObjectId("5a04c2a43b92e9ec9e55c690"), // cannot be empty
}
// CLIENT
{
  _id: ObjectId("5a04c2e82e34dd04082fc414"),
  name: 'Some Foo Client',
  publicKey: '3c72e3d1-8d02-4633-8958-02f03a9f070c',
  origins: [],
  workspace: ObjectId("5a04c2c82e34dd04082fc413"),
  namespace: 'acbm-fcp', // Auto-updates based on tenant and workspace.
}
```
---

## Incoming User Identification
In order to identify a user from a third party source, the destination link needs to be decorated with the user entity information. If the proper parameters are present, the library will append the user information for future event requests. This is commonly used to identify users coming from a known source, such as e-mail deployments.

For example, an e-mail may have a link to `https://www.domain.com`. To identify the incoming user, the link would be decorated as follows:
`https://www.domain.com?sap.usr[id]={{userId}}&sap.usr[ns]={{zone/base/name}}`
The library will recognize the provided `usr` parameters and append the information to the local cookie for future use. The format and requiremens of the `id` and `ns` follow those of the regular event tracker. If the `id` or `ns` are empty (or otherwise invalid), the identification request will be ignored.

### Handling Multiple Identifier Types
Some systems support multiple user identifiers, such as by an email address or by an internal system ID. Generally speaking, one identifier should be chosen and used consistently. That being said, it is possible to use "fallback" identifiers, where each value is evaluated and, if empty, will be skipped. For example, user data could be sent as: `https://www.domain.com?sap.usr[id]={{email}};{{uid}}&sap.usr[ns]={{zone/base/name}}`. In this case, if `email` is present, it will be used (and `uid` would be ignored). If `email` is not present, `uid` will be used. If all are empty, the identification will be ignored.

## Cookie Handling
Name: `__sap_v`
Domain: The active root domain, so `foo.com`, `www.foo.com` and `local.foo.com` would all resolve to `foo.com`.
Value:
```js
JSON.stringify({

});
```

## Session Handling
Session handling is still uncertain. Currently, sessions/visits are not handled by this engine. The proposed structure is as follows:

Websites utilizing the Javascript library will maintain sessions in-browser via cookies and/or local storage. Session handling for native applications or backend/cURL requests are not yet handled or supported. Other tracking locations that do not support the JS library (such as email deployments) will attempt to handle sessions in a "special" way.

## Click Trackers / Redirects
You may want to track data about a click and then redirect the user to another location. This is very common with advertisement click URLs, or third-party links in email deployments. This is where click trackers come into play.

Destination URL: https://www.cat.com
Action: click

`/redir?des=https://www.cat.com`

Will automatically assume a click action, unless specified?
`{{sapienceHost}}/c?des=https%3A%2F%2Fwww.cat.com&act=click&ent=1234!xyz*cygnus-vspc.sponsored.campaign-native-ad`
Would then redirect to:
`https://www.cat.com?sap.src=1234!xyz*cygnus-vspc.sponsored.campaign-native-ad`
With a shortened URL:
`{{sapienceHost}}/c/xhf4893`
The URL ID `xhf4893` would have the `des`, `act` and `ent` values already saved.

**Dynamically Passed Vars**


**TO DO:** Click trackers may need to redirect, or they may need to add link decoration. (see "Incoming User Idenification")
Decorating assumes that the Sapience JS library is located on the destination URL.
- User decorating: `{{destinationURL}}?sap.usr={{identifier*zone.base.name}}`
- Session decorating: `{{destinationURL}}?sap.ses={{sessionId}}&sap.vis={{visitorId}}`
- Source decorating: `{{destinationURL}}?sap.src={{identifier*zone.base.name}}`
Decorated links can also be shortened using a redirect.


## Event Beacons

## Tracking Scenerios
### Sponsored Content Tracking
**Content Page View**
```js
{
  act: 'view',
  d: new Date(),
  ent: {
    id: 'id-generated-by-sc-app',
    ns: 'cygnus.vspc.post', // the tenant of the sc app, plus the content
  },
  usr: {} // would be appended by link decoration
  ctx: {}, // would be the window.location data
  src: {}, // would be appended by link decoration
}
```
**Campaigns**
Native Ad Campaigns
```js
// For the view/impression
{
  act: 'view', // or "impression"
  d: new Date(),
  ent: {
    id: 'some-campaign-id-from-sc-app',
    ns: 'cygnus.vspc.native-ad', // The tenant of the sc app, plus the campaign type
  },
  ctx: {
    id: '/path-name',
    ns: '-/www-vehicleservicepros-com/page',
  }, // Would be some sort of website context identifier.
},
// For the click-thru.
{
  act: 'click', // or "impression"
  d: new Date(),
  ent: {
    id: 'some-campaign-id-from-sc-app',
    ns: 'cygnus.vspc.native-ad', // The tenant of the sc app, plus the campaign type
  },
  ctx: {}, // Would be some sort of website context identifier.
}
// The resulting content view
{
  act: 'view',
  d: new Date(),
  ent: {
    id: 'id-generated-by-sc-app',
    ns: 'cygnus.vspc.post', // the tenant of the sc app, plus the content
  },
  usr: {} // would be appended if present
  src: {
    id: 'some-campaign-id-from-sc-app',
    ns: 'cygnus.vspc.native-ad'
  },
}
```
The click would also need to bake a redirect in, with the campaign signifier.

### E-Mail Deployments
**Track an email open**
The containing context for all email deployment events is the email deployment entity. Let's use Omail as an example. Each "list" is categorized as a deployment type, so the email deployment entity would be as follows:
```js
{
  id: 'AVVDB171129007', // The deployment track id.
  ns: 'vsp/omail/deployment', // Signifies it is a `deployment` entity within VSP's Omail instance.
}
```
In addition, all newsletter users are identified to some degree, so each request would also contain the `usr` attribute. Again, using Omail/Omeda as an example:
```js
{
  id: '7444C1917023I6R', // The encrypted customer id.
  ns: 'vsp/omeda/customer', // Signifies it is a `customer` entity within VSP's Omeda instance.
}
```

Tracking the email open is relatively straight-forward, and would be stored as:
```js
{
  act: 'open',
  d: new Date(),
  ent: { id: 'AVVDB171129007', ns: 'vsp.omail.deployment' },
  usr: { id: '7444C1917023I6R', ns: 'vsp.omeda.customer' },
  ctx: { id: 'AVVDB171129007', ns: 'vsp.omail.deployment' },
}
```
It becomes apparent that there is redundancy here, as the `ent` and `ctx` values are the same. There are varying schools of thought on how this could be handled. The event is either stored as shown, or one of the redudant values are removed. If the `ent` value is removed, the assumption would be that the action was applied to the entire containing context, not on an entity within it. If the `ctx` value is removed, there would be no way to tie "like-events" together, without adding additional query complexity (i.e. to see all events for `5491`, both `ent` AND `ctx` would need to be included, which may actually be incorrect in some cases). Because of these factors, it's likely better to include both values for consistency, even if they're the same. Furthermore, the `ctx` value may also contain additional metadata that the `ent` value would not have.

The actual placement of the open tracking can done in numerous ways.
1. Directly calling the event URL in an `<img src="">` element statically
  - `/events/open.gif?key={{clientKey}}&ent[id]=AVVDB1711290075491&ent[ns]=vsp/omail/deployment&usr[id]=7444C1917023I6R&usr[ns]=vsp/omeda/customer%ctx...`
2. Directly calling the event URL in an `<img src="">` element dyanamically with merge vars
  - Interestingly enough, Omail doesn't support enough merge variables to make this work
  - `/events/open.gif?key={{clientKey}}&ent[id]=AVVDB171129007&ent[ns]=vsp/omail/deployment&usr[id]=@{encrypted_customer_id}@&usr[ns]=vsp/omeda/customer%ctx...`
3. Using an pre-defined encoded beacon, with the ability to pass dynamic values
  - `/b/{{beaconId}}.gif?usr[id]=@{encrypted_customer_id}@`
  - The beacon will already contain the `key`, `ent`, and `ctx` values, as well as parts of the `usr` value.

**Track an email click**
Tracking email clicks is a bit more involved, as redirects need to be taken into consideration. The ESP will also "obfuscate" our URLs with their own tracking redirects. There may also be the need to track multiple entities per click, or provide the destination website with user identification attributes. In addition, dynamic variables may need to be passed that are outside the scope of Sapience. Finally, if the destination website is also handled by Sapience, additional entity data may also need to be appended the event (e.g. a user clicks on content that also has sapience data). We may also need to track raw URL clicks as well.

At the heart of click tracking is the `ctx` value, which will be our deployment type from the previous example. This allows us to group all click events to the specific deployment.
```js
{
  act: 'click',
  d: new Date(),
  ent: {}, // Whatever entity was clicked
  usr: { id: '7444C1917023I6R', ns: 'vsp/omeda/customer' },
  ctx: { id: 'AVVDB171129007', ns: 'vsp/omail/deployment' },
}
```

Manually include:
```html
<img src="/events/open?ent[id]={{deploymentId}}&amp;ent[ns]={{zone/base/name}}&amp;usr[id]">
```
**Track a click within an email**
  - For an owned domain (that has the sapience library)
  - For an un-owned domain (does not have the sapience library)
  - Attribute multiple entities per click (for instance, it's a content click, but also an organization click)

## Root Endpoints / Routers
- Events `/e/{act}.{ext}`
  - Requires a client key
  - Client must allow the incoming resource location (e.g. CORs)
  - Handles writing events to the database
- Shortened Redirect `/c/{identifier}`
- Open Redirect `/c`
- Beacons `/v/{identifier}.{ext}`
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

## Database Structure
Database naming convention: `sap-[tenant]-[workspace]`
Collections:
- Ephemeral Events: `events`
  - Capped with a TTL index.
- Aggregated Events
- Session Aggregation
- Content Aggregation

### Events
Emphemeral events are stored in the `events` collection. This collection is capped with a TTL index, so it doesn't get too large. No pre-aggregation is handled and data is stored for 24 hours.
```js
{
  _id: ObjectId(''), // A unique, internal identifier.
  act: 'view', // The action verb. Required. Cannot be empty.
  d: ISODate(''), // The date of the event. TTL indexed, max of 24 hours.
  /**
   * The stringified entity key. References the `entities.key` field.
   * Required. Cannot be empty.
   */
  ent: 'identifier*zone/base/name',
  /**
   * The stringified user key. References the `users.key` field.
   * Anonymous users are also assigned a user value.
   * Required. Cannot be empty.
   */
  usr: 'identifier*zone/base/name',
  /**
   * A UUID representing a session.
   * If no session is present, or non-applicable, will not be set.
   */
  ses: '3b66e7b2-8a0c-44cb-84b6-805944d19328',
}
```

### Entities
All entities are uniquely stored in the `entities` collection.
```js
{
  _id: ObjectId(''), // A unique, internal identifier.
  key: 'identifier*zone/base/name', // The stringified entity key. Uniquely indexed.
  ent: { // The entity object, for query purposes. Uniquely indexed?
    id: 'identifier',
    ns: {
      z: 'zone',
      b: 'base',
      n: 'name',
    },
  },
},
```

### Users
All users are uniquely stored in the `users` collection.
```js
{
  _id: ObjectId(''), // A unique, internal identifier.
  key: 'identifier*zone/base/name', // The stringified entity key. Uniquely indexed.
  usr: { // The entity object, for query purposes. Uniquely indexed?
    id: 'identifier',
    ns: {
      z: 'zone',
      b: 'base',
      n: 'name',
    },
  },
  anon: true, // Flag whether the user is considered anonymous. Indexed.
},
```
