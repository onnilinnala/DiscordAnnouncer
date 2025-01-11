import { Center, Flex, Heading, SimpleGrid, Text, Button, Icon } from '@chakra-ui/react';
import { LoadingPanel } from '@/components/panel/LoadingPanel';
import { QueryStatus } from '@/components/panel/QueryPanel';
import { config } from '@/config/common';
import { guild as view } from '@/config/translations/guild';
import { BsMailbox } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';
import { useGuildInfoQuery } from '@/api/hooks';
import { useRouter } from 'next/router';
import { getAnnouncements } from '@/api/bot';
import { Banner } from '@/components/GuildBanner';
import { AnnouncementItem } from '@/components/announcement/AnnouncementItem';
import type { CustomGuildInfo } from '@/config/types/custom-types';
import { NextPageWithLayout } from '@/pages/_app';
import getGuildLayout from '@/components/layout/guild/get-guild-layout';
import { useAccessToken } from '@/utils/auth/hooks';
import { useEffect, useState } from 'react';

const GuildPage: NextPageWithLayout = () => {
  const t = view.useTranslations();
  const guild = useRouter().query.guild as string;
  const query = useGuildInfoQuery(guild);

  return (
    <QueryStatus query={query} loading={<LoadingPanel />} error={t.error.load}>
      {query.data != null ? (
        <GuildPanel guild_id={guild} info={query.data} />
      ) : (
        <NotJoined guild={guild} />
      )}
    </QueryStatus>
  );
};

function GuildPanel({ guild_id, info }: { guild_id: string; info: CustomGuildInfo }) {
  const t = view.useTranslations();
  const accessToken = useAccessToken();

  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAnnouncements() {
      const results = await getAnnouncements(accessToken!!, guild_id);
      setAnnouncements(results);
    }

    fetchAnnouncements();
  }, [accessToken, guild_id]);

  return (
    <Flex direction="column" gap={5}>
      <Flex direction="column" gap={5} mt={3}>
        <Heading size="md">{t.bn.settings}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, '2xl': 3 }} gap={3}>
          <AnnouncementItem
            key={1}
            name={"Administrator Settings"}
            guild_id={guild_id}
            enabled={true}
          />
        </SimpleGrid>
        <Heading size="md">{t.announcements}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, '2xl': 3 }} gap={3}>
          {announcements.map((announcement) => (
            <AnnouncementItem
              key={announcement.id}
              announcement_id={announcement.id}
              name={announcement.name}
              guild_id={guild_id}
              enabled={announcement.enabled}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

function NotJoined({ guild }: { guild: string }) {
  const t = view.useTranslations();

  return (
    <Center flexDirection="column" gap={3} h="full" p={5}>
      <Icon as={BsMailbox} w={50} h={50} />
      <Text fontSize="xl" fontWeight="600">
        {t.error['not found']}
      </Text>
      <Text textAlign="center" color="TextSecondary">
        {t.error['not found description']}
      </Text>
      <Button
        variant="action"
        leftIcon={<FaRobot />}
        px={6}
        as="a"
        href={`${config.inviteUrl}&guild_id=${guild}`}
        target="_blank"
      >
        {t.bn.invite}
      </Button>
    </Center>
  );
}

GuildPage.getLayout = (c) => getGuildLayout({ children: c });
export default GuildPage;
