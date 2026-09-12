import { html, Html } from "@elysia/html";

interface BaseLayoutProps {
    title: string;
    children?: JSX.Element | JSX.Element[];
}

export function BaseLayout(props: BaseLayoutProps) {
    // TODO : throw if env doesnt exist
    const version = process.env.VERSION;
    return (
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/public/favicon.svg"
                />
                <script defer src="/public/htmx.min.js"></script>
                <link
                    rel="stylesheet"
                    href={`/public/styles.css?v=${version}`}
                />
                <script defer src={`/public/index.js?v=${version}`}></script>
                <title>{props.title}</title>
            </head>
            <body>{props.children}</body>
        </html>
    );
}
