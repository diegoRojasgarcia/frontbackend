# PRECOS-FE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

##### Platform Scalability

To add new components to the project, follow the current file structure:  
- core: Do add new element to this module only if these are singleton. Make sure to not reference these elements mora than once.  
- shared:  From Angular [docs](https://angular.io/guide/file-structure).  
>Do create a feature module named SharedModule in a shared folder; for example, `app/shared/shared.module.ts` defines SharedModule.  
>Do declare components, directives, and pipes in a shared module when those items will be re-used and referenced by the components declared in other feature modules.  
>Do declare all components, directives, and pipes in the SharedModule.  
>Do export all symbols from the SharedModule that other feature modules need to use.  
- features: From Angular [docs](https://angular.io/guide/file-structure).  
>Do create an NgModule for all distinct features in an application; for example, a Heroes feature. All feature areas are in their own folder, with their own NgModule.  
>Do place the feature module in the same named folder as the feature area; for example, in `app/heroes`.  
>Do name the feature module file reflecting the name of the feature area and folder; for example, `app/heroes/heroes.module.ts`.  
>Do name the feature module symbol reflecting the name of the feature area, folder, and file; for example, `app/heroes/heroes.module.ts` defines HeroesModule.  

To add new Privileges and Permissions, do it following the current structure described in `app\src\core\models\privileges.ts` and add it to the `app\src\assets\admin\privileges.json` file.  

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## PRECOS-FE Documentation

Run `compodoc -s` to see the documentation for the PRECOS Frontend platform. To run it on a diferent port, add the `-r [port]` option to the aforementioned command.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.  
To get more help on the Compodoc auto-generated documentation go and check out the [Compodoc Documentation](https://compodoc.app/guides/getting-started.html) page.  
This project has been made using the Angular Material material design library, to learn more about check the [Angular Material](https://material.angular.io) documentation page.