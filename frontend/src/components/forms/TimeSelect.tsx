import { Calendar, CalendarProps } from 'react-calendar';
import { FormCard } from './Form';
import { ControlledInput } from './types';
import { Icon, useColorModeValue } from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Text } from '@chakra-ui/layout';
import {
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { AiTwotoneCalendar as CalendarIcon } from 'react-icons/ai';
import { useController } from 'react-hook-form';
import { TimePicker } from "antd";
import dayjs from 'dayjs';
import { colors } from '@/theme/colors';


export type TimePickerFormProps = Omit<CalendarProps, 'value' | 'onChange'>;

export const TimePickerForm: ControlledInput<TimePickerFormProps, CalendarProps['value']> = ({
  control,
  controller,
  ...props
}) => {
  const {
    field: { ref, ...field },
    fieldState,
  } = useController(controller);
  
  const format = 'HH:mm';

  return (
    <FormCard {...control} error={fieldState.error?.message}>
            <TimePicker defaultValue={dayjs('12:00', format)} format={format} />;
    </FormCard>
  );
};

export const SmallTimePickerForm: ControlledInput<TimePickerFormProps, CalendarProps['value']> = ({
  control,
  controller,
  ...props
}) => {
  const {
    field: { ref, ...field },
    fieldState,
  } = useController(controller);
  
  const format = 'HH:mm';

  const theme = useColorModeValue('light', 'dark');

  return (
    <FormCard {...control} error={fieldState.error?.message}>
      <TimePicker defaultValue={dayjs('12:00', format)} format={format} style={{background: colors.navy["800"], color: "white", borderColor: colors.navy["600"], borderRadius: 12}}/>
    </FormCard>
  );
};
