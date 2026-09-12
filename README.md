# Macro Budget

a top-down approach for lazy budgeting

## setup

```bash
# install dependencies
bun install

# setup .env
cp .env.example .env

# setup db
bun run db:push

# start server at port 5000
PORT=5000 bun run start
```

## commands

```bash
# start server at port 3000
bun run start

# dev server at port 3000
bun run dev

# run all tests
bun test

# push schema to db.sqlite
bun run db:push
```

## project docs

- [project tech stack](./TECH_STACK.md)
- [project code conventions](./CODE_CONVENTIONS.md)

