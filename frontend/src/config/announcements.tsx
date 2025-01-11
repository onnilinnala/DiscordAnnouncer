
import { AnnouncementConfig } from './types';

export const announcements: AnnouncementConfig = {
    channel_id: "",
    content: "",
    timestamp: 0,
    period: "",
    enabled: true,
    useRender() {
        return {
            component: <></>,
            onSubmit: () => {},
        };
    }
};