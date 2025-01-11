import { Box, Center, Flex, Text } from '@chakra-ui/layout';
import { Button, ButtonGroup, Card, CardBody, CardFooter } from '@chakra-ui/react';
import { Announcement } from '@/api/bot';
import { IoOpen, IoOptions } from 'react-icons/io5';
import { useEditAnnouncementMutation } from '@/api/hooks';
import { guild as view } from '@/config/translations/guild';
import Router from 'next/router';

export function AnnouncementItem({
  announcement_id,
  name,
  guild_id,
  enabled,
}: {
  announcement_id: string;
  name: string;
  guild_id: string;
  enabled: boolean;
}) {
  const t = view.useTranslations();
  const mutation = useEditAnnouncementMutation();

  return (
    <Card variant="primary">
      <CardBody as={Flex} direction="row" gap={3}>
        <Box flex={1}>
          <Text fontSize={{ base: '16px', md: 'lg' }} fontWeight="600">
            {name}
          </Text>
        </Box>
      </CardBody>
      <CardFooter as={ButtonGroup} mt={3}>
        <Button
          size={{ base: 'sm', md: 'md' }}
          disabled={mutation.isLoading}
          {...({
            variant: 'action',
            rounded: '2xl',
            leftIcon: <IoOptions />,
            onClick: () => Router.push(`/guilds/${guild_id}/announcements/${announcement_id}`),
            children: t.bn['config feature'],
          })}
        />
      </CardFooter>
    </Card>
  );
}
