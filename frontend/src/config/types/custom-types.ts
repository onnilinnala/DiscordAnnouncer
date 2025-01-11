import { Announcement } from '@/api/bot';
import { ReactElement, ReactNode } from 'react';
/***
 * Custom types that should be configured by developer
 ***/

import { z } from 'zod';
import { GuildInfo } from './types';

export type CustomGuildInfo = {
  id: string;
  name: string;
  icon: string;
  announcements: Announcement[];
};

export type AnnouncementConfig = {
  channel_id: string;
  content: string;
  timestamp: number;
  period: string;
  enabled: boolean;

  useRender: UseFormRender<AnnouncementConfig>;
  useSkeleton?: () => ReactNode;
};

type SubmitFn<T> = (data: FormData | string) => Promise<T>;

export type UseFormRenderResult = {
  /**
   * Save bar will be disappeared if `canSave` is false
   */
  canSave?: boolean;

  /**
   * called on submit
   */
  onSubmit: () => void;

  /**
   * Reset current value
   */
  reset?: () => void;

  component: ReactElement;
};

export type UseFormRender<T = unknown> = (data: T, onSubmit: SubmitFn<T>) => UseFormRenderResult;