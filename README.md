# Angular 21 Technical Test — Categories UI

Standalone Angular 21 application built to display, filter, sort, and select categories from API data.

## Features

- fetch all categories and visible categories from API
- display only visible categories
- group categories by category group
- search by category name
- filter by category group
- switch between grouped view and alphabetical view
- select one category at a time
- keep consulted categories visually highlighted
- enable footer action only when a category is selected

## Tech Stack

- Angular 21
- Standalone components
- Signals
- SCSS
- Angular Router
- HttpClient

## Run locally

```bash
npm install
ng serve --proxy-config proxy.conf.json

Open:

http://localhost:4200
Build
ng build --configuration production
Notes

This project was built with a simple and maintainable architecture, using Angular modern features without adding unnecessary complexity.

Author

Kévin Videau