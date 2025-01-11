import { Icon } from '@chakra-ui/react';
import { Center, Heading, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { LoadingPanel } from '@/components/panel/LoadingPanel';
import { Announcement } from '@/api/bot';
import { BsSearch } from 'react-icons/bs';
import { useEditAnnouncementMutation, useAnnouncementQuery } from '@/api/hooks';
import { UpdateAnnouncementPanel } from '@/components/announcement/UpdateAnnouncementPanel';
import { announcement as view } from '@/config/translations/announcement';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '@/pages/_app';
import getGuildLayout from '@/components/layout/guild/get-guild-layout';
import { useEffect, useState } from 'react';
import { useAccessToken } from '@/utils/auth/hooks';
import { getAnnouncement } from '@/api/bot';

export type Params = {
  guild: string;
  announcement: string;
};

export type UpdateAnnouncementValue<K extends keyof Announcement> = Partial<Announcement[K]>;

const AnnouncementPage: NextPageWithLayout = () => {
  const accessToken = useAccessToken();
  const { guild, announcement } = useRouter().query as Params;
  const query = useAnnouncementQuery(guild, announcement);
  const announcementData = query.data!!;
  if (query.isLoading) return <LoadingPanel />;
  if (announcement == null) return <NotFound />;
  return <UpdateAnnouncementPanel key={announcement} announcementData={announcementData} />;
};

function NotFound() {
  const t = view.useTranslations();

  return (
    <Center flexDirection="column" gap={2} h="full">
      <Icon as={BsSearch} w="50px" h="50px" />
      <Heading size="lg">{t.error['not found']}</Heading>
      <Text color="TextSecondary">{t.error['not found description']}</Text>
    </Center>
  );
}

AnnouncementPage.getLayout = (c) => getGuildLayout({ children: c, back: true });
export default AnnouncementPage;
