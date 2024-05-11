// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en" class="h-full">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {assets}
                </head>
                <body class="h-full">
                    <div id="app" class="h-full bg-neutral-950 text-white">
                        {children}
                    </div>
                    {scripts}
                </body>
            </html>
        )}
    />
));
