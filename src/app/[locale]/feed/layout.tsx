import { type ReactElement } from "react";
import { I18nProviderClient } from "locales/client";
import { ServerClientEmbedPrompt } from "components/server-client-embed";

export default function SubLayout({
  params: { locale },
  children,
}: {
  params: { locale: string };
  children: ReactElement;
}) {
  return (
    <I18nProviderClient locale={locale}>
      <ServerClientEmbedPrompt locale={locale}>
        {children}
      </ServerClientEmbedPrompt>
    </I18nProviderClient>
  );
}
