import { FaChevronLeft as ChevronLeftIcon } from 'react-icons/fa';
import { Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Icon, IconButton } from '@chakra-ui/react';
import { HSeparator } from '@/components/layout/Separator';
import { IoSettings } from 'react-icons/io5';
import { useGuildPreview } from '@/api/hooks';
import { sidebarBreakpoint } from '@/theme/breakpoints';
import { guild as view } from '@/config/translations/guild';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Params } from '@/pages/guilds/[guild]/announcements/[announcement]';
import { SidebarItem } from '../sidebar/SidebarItem';

export type Params = {
  guild: string;
  announcement: string;
};

export function InGuildSidebar() {
  const router = useRouter();
  const { guild: guild_id, announcement } = router.query as unknown as Params;
  const { guild } = useGuildPreview(guild_id);

  const t = view.useTranslations();

  return (
    <Flex direction="column" gap={2} p={3}>
      <HStack as={Link} cursor="pointer" mb={2} href={`/guilds/${guild_id}`}>
        <IconButton
          display={{ base: 'none', [sidebarBreakpoint]: 'block' }}
          icon={<Icon verticalAlign="middle" as={ChevronLeftIcon} />}
          aria-label="back"
        />
        <Text fontSize="lg" fontWeight="600">
          {guild?.name}
        </Text>
      </HStack>
      <VStack align="stretch">
        <SidebarItem
          href={`/guilds/${guild_id}/settings`}
          active={router.route === `/guilds/[guild]/settings`}
          icon={<Icon as={IoSettings} />}
          name={t.bn.settings}
        />
      </VStack>
    </Flex>
  );
}
