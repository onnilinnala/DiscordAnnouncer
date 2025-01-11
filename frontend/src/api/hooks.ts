import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { UserInfo, getGuild, getGuilds, fetchUserInfo } from '@/api/discord';
import {
  fetchUserGuilds,
  fetchGuildInfo,
  fetchGuildChannels,
  fetchGuildRoles,
  getAnnouncements,
  getAnnouncement,
  addAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
} from '@/api/bot';
import { useAccessToken } from '@/utils/auth/hooks';

export const client = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
    },
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 0,
    },
  },
});

export const Keys = {
  login: ['login'],
  guild_info: (guild: string) => ['guild_info', guild],
  announcements: (guild: string) => ['announcements', guild],
  announcement: (guild: string, announcement_id: string) => ['announcement', guild, announcement_id],
  guildRoles: (guild: string) => ['guild_roles', guild],
  guildChannels: (guild: string) => ['guild_channels', guild],
};

export function useGuild(id: string) {
  const accessToken = useAccessToken();

  return useQuery(['guild', id], () => getGuild(accessToken as string, id), {
    enabled: accessToken != null,
  });
}

export function useGuilds() {
  const accessToken = useAccessToken();

  return useQuery(['user_guilds'], () => fetchUserGuilds(accessToken as string), {
    enabled: accessToken != null,
  });
}

export function useSelfUserQuery() {
  const accessToken = useAccessToken();

  return useQuery<UserInfo>(['users', 'me'], () => fetchUserInfo(accessToken!!), {
    enabled: accessToken != null,
    staleTime: Infinity,
  });
}

export function useGuildInfoQuery(guild: string) {
  const accessToken = useAccessToken();

  return useQuery(Keys.guild_info(guild), () => fetchGuildInfo(accessToken!!, guild), {
    enabled: accessToken != null,
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 0,
  });
}

export function useAnnouncementsQuery(guild: string) {
  const accessToken = useAccessToken();

  return useQuery(Keys.announcements(guild), () => getAnnouncements(accessToken!!, guild), {
    enabled: accessToken != null,
  });
};

export const useAnnouncementQuery = (guild: string, announcement_id: string) => {
  const accessToken = useAccessToken();
  return useQuery(Keys.announcement(guild, announcement_id), () => getAnnouncement(accessToken!!, guild, announcement_id), {
      enabled: !!guild && !!announcement_id,
  });
};

export type AnnouncementOptions = {
  guild: string;
  announcement_id?: number;
  announcement: {
    user_id: string;
    channel_id: number;
    content: string;
    timestamp: number;
    period: string;
    enabled: boolean;
  };
};

export function useAddAnnouncementMutation() {
  const accessToken = useAccessToken();

  return useMutation(
    ({ guild, announcement }: AnnouncementOptions) =>
      addAnnouncement(accessToken!!, guild, announcement),
    {
      onSuccess(_, { guild }) {
        client.invalidateQueries(Keys.announcements(guild));
      },
    }
  );
};

export function useEditAnnouncementMutation() {
  const accessToken = useAccessToken();

  return useMutation(
    ({ guild, announcement_id, announcement }: AnnouncementOptions) =>
      editAnnouncement(accessToken!!, guild, announcement_id!, announcement),
    {
      onSuccess(_, { guild }) {
        client.invalidateQueries(Keys.announcements(guild));
      },
    }
  );
};

export function useDeleteAnnouncementMutation() {
  const accessToken = useAccessToken();

  return useMutation(
    ({ guild, announcement_id }: { guild: string; announcement_id: number }) =>
      deleteAnnouncement(accessToken!!, guild, announcement_id),
    {
      onSuccess(_, { guild }) {
        client.invalidateQueries(Keys.announcements(guild));
      },
    }
  );
};

export function useGuildRolesQuery(guild: string) {
  const accessToken = useAccessToken();

  return useQuery(Keys.guildRoles(guild), () => fetchGuildRoles(accessToken!!, guild));
};

export function useGuildChannelsQuery(guild: string) {
  const accessToken = useAccessToken();

  return useQuery(Keys.guildChannels(guild), () => fetchGuildChannels(accessToken!!, guild));
};

export function useSelfUser(): UserInfo {
  return useSelfUserQuery().data!!;
};

export function useGuildPreview(guild: string) {
  const query = useGuilds();

  return {
    guild: query.data?.find((g) => g.id === guild),
    query,
  };
};
