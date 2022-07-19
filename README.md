## Migrations

Migrations are generated form Entity changes.
When you have made some changes to the entities and you want to create migrations for them, first you need to run:

> `npm run build`

As the changes are identified by `/dist` folder compiled entities.

Then run:

> `npm run migration:generate {addSomeExampleFieldToSomeExampleTable}`

## Architecture

It uses the micro backend architecture, where every micro app inside the backend is represented as an `app-` folder.

Every Micro App is a list (group) of resources.

If you want to create a new micro app go to the `src` folder and generate a new module with:

> `npx @nestjs/cli g module app-auth`

This will create a folder app-auth and will add a new module configuration file in it `app-auth.module.ts`

It will be also added to the main app module into the imports

The concept of the resource is crucial in the case of MVC architecture as it represent a `Model`.

To create a new resource inside an app go to the specific app, for example we will use app-api for the api micro backend app

> `cd app-api`

and execute:

> `npx @nestjs/cli resource resourceName --no-spec`

where resourceName is the name you want to give to the resource. The resource will have:

- controller file in plural -> should be changed after the creation
- service file in singular
- entity file in singular

The entity files is better to be placed in a single folder in the directory of `app-` so can be used across the app.

After creating the module with the command or better with a copy paste from an existing module, some changes to be considered:

1. Entities can extend BasicEntity, so some general fields are not written always
2. Write all the DTO as they help also with docs
3. The controller extends BaseController which has some some helper functions.

Also we will use Transformation of resources according to:
<https://docs.nestjs.com/techniques/serialization>, and its better to use to use different classes for different results we want to provide

PS:
Instead of using npx is better to use local `@nestjs/cli`
