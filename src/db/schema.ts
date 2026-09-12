import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// TODO : research if Postgres is better, whether this app count as many concurrent writes
// TODO : - if so, setup docker compose up which includes postgres service

// TODO : usersTable, authSessionsTable (better-auth)

// TODO : concept of roles and shared resources
// TODO : - admin: creator is admin by default, can delete, can assign roles
// TODO : - editor: can add, can edit, cannot delete accounts, can delete balances tho
// TODO : - viewer: read-only
// TODO : need to think of the UX
// TODO : - story 1: couple shared finances, mainly managed by one, the other occasionally edits (admin + editor)
// TODO : - story 2: couple independent finances but transparent to each other (admin + admin)

// TODO : indexes if necessary

// TODO : save user settings/preferences? eg. default toggles, saved filters etc...

// TODO : we need to support undo, so all actions need to be reversible
export const userActions = ["create", "edit", "delete"] as const;
export type UserAction = (typeof userActions)[number];
export const userActionHistoryTable = sqliteTable("user_action_history_table", {
    // --- required
    id: int().primaryKey(),
    timestamp: int({ mode: "timestamp_ms" }).notNull(),
    action: text({ enum: userActions }).notNull(),

    // TODO : json...?
    resource: text().notNull(),

    // --- optional

    // TODO : json...?
    oldData: text(),
    newData: text(),
});

// this is more like a "cache" for objective truth lazily pulled from online sources
// for now... we dont need to support currency snapshots... i guess
export const currenciesTable = sqliteTable("currencies_table", {
    id: int().primaryKey({ autoIncrement: true }),
    code: text().unique().notNull(),
    name: text().notNull(),
    scale: int().notNull(), // decides how many decimals a currency has
    rateToUsdAmount: int().notNull(),
    rateToUsdScale: int().notNull(), // can be different from scale, the rate might be very granular

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

export const accountsTable = sqliteTable("accounts_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),

    // child account currency can differ from parent account currency
    currencyId: int()
        .references(() => currenciesTable.id)
        .notNull(),

    // --- required with defaults
    isOnBudget: int({ mode: "boolean" }).notNull().default(true),
    isHidden: int({ mode: "boolean" }).notNull().default(false),
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),

    // --- optional
    // TODO : look up how to self reference
    // parentId: int().references(() => accountsTable.id),
});

// with account balance, can infer macro trends
export const accountBalancesTable = sqliteTable("account_balances_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    accountId: int()
        .references(() => accountsTable.id)
        .notNull(),
    timestamp: int({ mode: "timestamp_ms" }),

    // can be negative (eg. credit card debts)
    // uses account currency scale for number of decimal places
    unscaledAmount: int().notNull(),

    // --- required with defaults
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

// with income transactions, can infer monthly expenses
// with parent expense transactions, can broadly track expenses without each individual child expense
export const transactionTypes = ["income", "expense"] as const;
export type TransactionTypes = (typeof transactionTypes)[number];
export const accountTransactionsTable = sqliteTable(
    "account_transactions_table",
    {
        // --- required
        id: int().primaryKey({ autoIncrement: true }),
        accountId: int()
            .references(() => accountsTable.id)
            .notNull(),

        // either an income or an expense
        type: text({ enum: transactionTypes }).notNull(),

        // currency can be different from account currency
        currencyId: int()
            .references(() => currenciesTable.id)
            .notNull(),

        timestamp: int({ mode: "timestamp_ms" }),

        // always positive, use type (income/expense) for differentiating +/-
        // uses account currency scale for number of decimal places
        unscaledAmount: int().notNull(),

        // --- required with defaults
        notes: text().notNull().default(""),

        // TODO : should default to Date now (see best practices if this is encouraged)
        createdAt: int({ mode: "timestamp_ms" }).notNull(),
        updatedAt: int({ mode: "timestamp_ms" }).notNull(),

        // --- optional
        // TODO : look up how to self reference
        // parentId: int().references(() => accountTransactionsTable.id),
    },
);

// "globally" used tags
export const tagsTable = sqliteTable("tags_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(), // not unique, users may use same name, check duplicates per-user

    // --- required with defaults
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

// many-to-many relationship
export const accountTagsTable = sqliteTable("account_tags_table", {
    // TODO : primary key is accountId,tagId

    accountId: int().references(() => accountsTable.id, {
        onDelete: "cascade",
    }),
    tagId: int().references(() => tagsTable.id, { onDelete: "cascade" }),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
});

// many-to-many relationship
export const transactionTagsTable = sqliteTable("transaction_tags_table", {
    // TODO : primary key is transactionId,tagId

    transactionId: int().references(() => accountTransactionsTable.id, {
        onDelete: "cascade",
    }),
    tagId: int().references(() => tagsTable.id, { onDelete: "cascade" }),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
});

export const budgetCategoriesTable = sqliteTable("budget_categories_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(), // not unique, users may use same name, check duplicates per-user

    // --- required with defaults
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

// very similar in spirit to accounts
// but much simplified by design - one category, no tags, no parent/child
export const budgetsTable = sqliteTable("budgets_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    currencyId: int()
        .references(() => currenciesTable.id)
        .notNull(),
    categoryId: int()
        .references(() => budgetCategoriesTable.id)
        .notNull(),

    // --- required with defaults
    isHidden: int({ mode: "boolean" }).notNull().default(false),
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

// very similar in spirit to account balances, NOT transactions
export const budgetAllocationsTable = sqliteTable("budget_allocations_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    budgetId: int()
        .references(() => budgetsTable.id)
        .notNull(),
    timestamp: int({ mode: "timestamp_ms" }),
    unscaledAmount: int().notNull(), // uses account currency scale for number of decimal places

    // --- required with defaults
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

export const owedLedgerCategoriesTable = sqliteTable(
    "owed_ledger_categories_table",
    {
        // --- required
        id: int().primaryKey({ autoIncrement: true }),
        name: text().notNull(), // not unique, users may use same name, check duplicates per-user

        // --- required with defaults
        notes: text().notNull().default(""),

        // TODO : should default to Date now (see best practices if this is encouraged)
        createdAt: int({ mode: "timestamp_ms" }).notNull(),
        updatedAt: int({ mode: "timestamp_ms" }).notNull(),
    },
);

// very similar in spirit to accounts
// but much simplified by design - one category, no tags, no parent/child
// exactly like budgets actually
export const owedLedgersTable = sqliteTable("owed_ledgers_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    currencyId: int()
        .references(() => currenciesTable.id)
        .notNull(),
    categoryId: int()
        .references(() => owedLedgerCategoriesTable.id)
        .notNull(),

    // --- required with defaults
    isHidden: int({ mode: "boolean" }).notNull().default(false),
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

// very similar in spirit to account transactions, NOT balances
// differences - has formulas, no parent/child
export const owedTransactionsTable = sqliteTable("owed_transactions_table", {
    // --- required
    id: int().primaryKey({ autoIncrement: true }),
    ledgerId: int()
        .references(() => owedLedgersTable.id)
        .notNull(),

    // currency can be different from ledger currency
    currencyId: int()
        .references(() => currenciesTable.id)
        .notNull(),

    timestamp: int({ mode: "timestamp_ms" }),

    // can be positive (i owe money) or negative (i returned money)
    // uses account currency scale for number of decimal places
    // if formula is non-empty, this should be derived from formula
    unscaledAmount: int().notNull(),

    // --- required with defaults
    formula: text().notNull().default(""), // may be easier to express as a formula
    notes: text().notNull().default(""),

    // TODO : should default to Date now (see best practices if this is encouraged)
    createdAt: int({ mode: "timestamp_ms" }).notNull(),
    updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});

