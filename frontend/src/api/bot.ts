import { callDefault, callReturn } from '@/utils/fetch/core';
import { botRequest } from '@/utils/fetch/requests';
import { ChannelTypes } from './discord';
import { UseFormRender, AnnouncementConfig } from '@/config/types/custom-types'

export type Role = {
  id: string;
  name: string;
  color: number;
  position: number;
  icon?: {
    iconUrl?: string;
    emoji?: string;
  };
};

export type GuildTextChannel = {
  channel_id: string;
  name: string;
};

export type Announcement = {
  id?: number;
  guild_id: string;
  user_id: string;
  name: string;
  channel_id: number;
  content: string;
  timestamp: number;
  period: string;
  enabled: boolean;
  
  useRender: UseFormRender<AnnouncementConfig>;
}

export type Guild = {
  id: string;
  name: string;
  icon: string;
  announcements: Announcement[];
};

export async function fetchGuildInfo(
  accessToken: string,
  guild: string
): Promise<Guild | null> {
  return await callReturn<Guild | null>(
    `/guilds/${guild}`,
    botRequest(accessToken, {
      request: {
        method: 'GET',
      },
      allowed: {
        404: () => null,
      },
    })
  );
}

/**
 * Get announcements for a guild
 *
 * @param accessToken AccessToken
 * @param guild Guild ID
 * @returns List of announcements
 */
export async function getAnnouncements(
    accessToken: string,
    guild_id: string
  ): Promise<Announcement[]> {
  return await callReturn<Announcement[]>(
    `/guilds/${guild_id}/announcements`,
    botRequest(accessToken, {
      request: {
        method: 'GET',
      },
    })
  );
}

/**
 * Get announcement from a guild
 *
 * @param accessToken AccessToken
 * @param guild Guild ID
 * @returns List of announcements
 */
export async function getAnnouncement(
  accessToken: string, 
  guild_id: string, 
  announcement_id: string
): Promise<Announcement> {
  return await callReturn<Announcement>(
    `/guilds/${guild_id}/announcements/${announcement_id}`,
    botRequest(accessToken, {
      request: {
        method: 'GET',
      },
    })
  );
}

/**
 * Add a new announcement to a guild
 *
 * @param accessToken AccessToken
 * @param guild Guild ID
 * @param announcement Announcement data
 */
export async function addAnnouncement(
  accessToken: string,
  guild: string,
  announcement: {
    user_id: string;
    channel_id: string;
    content: string;
    timestamp: number;
    period: string;
    enabled: boolean;
  }
) {
  return await callDefault(
    `/guilds/${guild}/announcements`,
    botRequest(accessToken, {
      request: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcement),
      },
    })
  );
}

/**
 * Edit an existing announcement
 *
 * @param accessToken AccessToken
 * @param guild Guild ID
 * @param announcement Announcement data
 */
export async function editAnnouncement(
  accessToken: string,
  guild: string,
  announcement_id: number,
  announcement: {
    user_id: string;
    channel_id: string;
    content: string;
    timestamp: number;
    period: string;
    enabled: boolean;
  }
) {
  return await callDefault(
    `/guilds/${guild}/announcements/${announcement_id}`,
    botRequest(accessToken, {
      request: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcement),
      },
    })
  );
}

/**
 * Delete an announcement from a guild
 *
 * @param accessToken AccessToken
 * @param guild Guild ID
 * @param announcement_id ID of the announcement
 */
export async function deleteAnnouncement(
  accessToken: string,
  guild: string,
  announcement_id: number
) {
  return await callDefault(
    `/guilds/${guild}/announcements/${announcement_id}`,
    botRequest(accessToken, {
      request: {
        method: 'DELETE',
      },
    })
  );
  
}

/**
 * Used for custom forms
 *
 * The dashboard itself doesn't use it
 * @returns Guild roles
 */
export async function fetchGuildRoles(accessToken: string, guild: string) {
  return await callReturn<Role[]>(
    `/guilds/${guild}/roles`,
    botRequest(accessToken, {
      request: {
        method: 'GET',
      },
    })
  );
}

/**
 * @returns Guild channels
 */
export async function fetchGuildChannels(accessToken: string, guild: string) {
  return await callReturn<GuildTextChannel[]>(
    `/guilds/${guild}/channels`,
    botRequest(accessToken, {
      request: {
        method: 'GET',
      },
    })
  );
}

/**
 * @returns User Guilds
 */
export async function fetchUserGuilds(accessToken: string) {
  return await callReturn<Guild[]>(
    `/guilds`,
    botRequest(accessToken, {
      request: {
        method: 'GET',
      },
    })
  );
}