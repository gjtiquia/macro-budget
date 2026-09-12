import { html, Html } from "@elysia/html";
import { BaseLayout } from "./layouts/BaseLayout";
import { SampleComponent } from "./components/HelloWorld";

export async function HomePage() {
    return (
        <BaseLayout title="Starter - Home">
            <SampleComponent />
        </BaseLayout>
    );
}
