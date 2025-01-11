import { Guild } from '@/api/discord';
import { ReactElement, ReactNode } from 'react';

export type AppConfig = {
  /**
   * bot name
   */
  name: string;
  /**
   * icon (react component)
   */
  icon?: (props: any) => ReactElement;
  /**
   * Guild settings
   */
  guild: GuildConfig;
  /**
   * Url to invite the bot
   *
   * example: `https://discord.com/api/oauth2/authorize?client_id=907955781972918281&permissions=8&scope=bot`
   */
  inviteUrl: string;
};

export type GuildConfig = {
  /**
   * Filter configurable guilds
   *
   * ex: to allow only if user permissions include ADMINISTRATOR
   * ```
   * import { PermissionFlags } from '@/api/discord';
   * (Number(guild.permissions) & PermissionFlags.ADMINISTRATOR) !== 0
   * ```
   */
  filter: (guild: Guild) => boolean;
};

export interface GuildInfo {
  enabledFeatures: string[];
}

export type Announcement = {
  id?: number;
  user_id: string;
  guild_id: string;
  name: string;
  channel_id: number;
  content: string;
  timestamp: number;
  period: string;
  enabled: boolean;
};