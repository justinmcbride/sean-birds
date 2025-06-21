import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react"
import { mantineTheme } from "./theme.ts";

import App from "./App.tsx";
import { GitHubLink } from "./GitHubLink.tsx";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme="auto" />
    <MantineProvider theme={mantineTheme} defaultColorScheme="auto">
      <Analytics />
      <Notifications />
      <App />
      <GitHubLink />
    </MantineProvider>
  </StrictMode>
);
