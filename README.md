# Macro Budget

a top-down approach for lazy budgeting
- the opposite of entering every transaction
- the more data we input, the more useful the insights
- but just a bit of data can still give useful insights
- start by inputting account balance snapshots
  - the "gaps" between snapshots are assumed flat
- this already gives
  - monthly start, end, net change, highs, lows
- we can then budget what we have
  - referencing YNAB / envelop-based budgeting, we dont budget based on income
  - we budget every dollar that we have, "giving every dollar a job"
- we can then input income transactions
- from that we can infer monthly expenses (= income - monthly net change)
- we can also mark down money that people owe us, so we wont forget

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

