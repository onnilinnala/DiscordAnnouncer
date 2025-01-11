import { RiErrorWarningFill as WarningIcon } from 'react-icons/ri';
import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/layout';
import { ButtonGroup, Button, Icon } from '@chakra-ui/react';
import { SlideFade } from '@chakra-ui/react';
import { AnnouncementConfig, UseFormRenderResult, Announcement } from '@/config/types';
import { IoSave } from 'react-icons/io5';
import { useEditAnnouncementMutation } from '@/api/hooks';
import { Params } from '@/pages/guilds/[guild]/announcements/[announcement]';
import { announcement as view } from '@/config/translations/announcement';
import { useRouter } from 'next/router';
import { MessageEditor } from '@/components/editor/MessageEditor'

export function UpdateAnnouncementPanel({
  announcementData,
}: {
  announcementData: Announcement;
}) {
  const { guild, announcement } = useRouter().query as unknown as Params;
  const mutation = useEditAnnouncementMutation();
  return (
    <div>
      <MessageEditor message={announcementData.content} guild_id={guild} announcement_id={announcement} />
    </div>
  );
}
