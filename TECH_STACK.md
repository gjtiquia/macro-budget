# tech stack

production

- [bun](https://bun.sh/)
- [elysia](https://elysiajs.com/)
- [drizzle with SQLite via Bun SQL](https://orm.drizzle.team/)
- [htmx 4](https://four.htmx.org/)
- [tailwindcss](https://tailwindcss.com/)

DX

- formatter: [prettier](https://prettier.io/)

## setup steps

### elysia

```bash
bun create elysia .
```

### drizzle

docs: https://orm.drizzle.team/docs/get-started/bun-sqlite-new

```bash
# install packages
bun add drizzle-orm@rc
bun add -D drizzle-kit@rc @types/bun

# setup .env and .env.example with DB_FILE_NAME=db.sqlite

# setup src/index.ts, src/db/schema.ts, and drizzle.config.ts

# apply changes to db
npx drizzle-kit push
```

### prettier

```bash
bun i -D prettier

# create .prettierrc
```

### htmx

- downloaded file from https://cdn.jsdelivr.net/npm/htmx.org@4.0.0/dist/htmx.min.js
- served under /public via elysia's static file plugin

### tailwind

- uses tailwind CLI to generate the css
- output served via /public/styles.css

## docs and notes

### elysia

- Best Practices - MVC pattern: https://elysiajs.com/essential/best-practice.html
- HTML and JSX: https://elysiajs.com/plugins/html
- Static Files: https://elysiajs.com/plugins/static.html

### drizzle

- SQLite Data Types: https://orm.drizzle.team/docs/sqlite/column-types
- SQLite Select: https://orm.drizzle.team/docs/sqlite/select
- SQLite Joins: https://orm.drizzle.team/docs/sqlite/joins

### frontend javascript

- we bundle it using Bun (see `package.json` and `/src/pages/scripts/index.ts`)

### htmx

- we are using HTMX 4 btw
    - changes from HTMX 2: https://four.htmx.org/docs#migrating-from-htmx-2x-to-4x
- Patterns: https://four.htmx.org/patterns
    - Lazy Load: https://four.htmx.org/patterns/lazy-load

## troubleshooting

- beware of html/js/css caching, we use git SHA to invalidate cache, try commiting things arent working (especially frontend scripts)
