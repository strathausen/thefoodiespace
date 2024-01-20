"use client";
import { AuthPrompts } from "api/auth/auth-page";
import { I18nProviderClient } from "locales/client";
import { SessionProvider } from "next-auth/react";

type Props = {
  locale: string;
  children: React.ReactNode;
};

export const ServerClientEmbedPrompt = ({ children, locale }: Props) => {
  return (
    <I18nProviderClient locale={locale}>
      <AuthPrompts>{children}</AuthPrompts>
    </I18nProviderClient>
  );
};

export const ServerClientEmbed = ({ children, locale }: Props) => {
  return (
    <I18nProviderClient locale={locale}>
      <SessionProvider>{children}</SessionProvider>
    </I18nProviderClient>
  );
};
