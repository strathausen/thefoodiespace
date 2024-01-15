"use client";
import { AuthPrompts } from "api/auth/auth-page";
import { I18nProviderClient } from "locales/client";

type Props = {
  locale: string;
  children: React.ReactNode;
};

export const ServerClientEmbed = ({ children, locale }: Props) => {
  return (
    <I18nProviderClient locale={locale}>
      <AuthPrompts>{children}</AuthPrompts>
    </I18nProviderClient>
  );
};
