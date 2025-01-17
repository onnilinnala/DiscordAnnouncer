import { tabsAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  tabpanel: {
    px: 0,
    pb: 0,
  },
});

export const tabsStyles = defineMultiStyleConfig({
  baseStyle,
});
