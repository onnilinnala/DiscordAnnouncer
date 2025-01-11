import { Option, SelectField } from '@/components/forms/SelectField';
import { forwardRef, useMemo } from 'react';
import { useGuildChannelsQuery } from '@/api/hooks';
import { useRouter } from 'next/router';
import { SelectInstance, Props as SelectProps } from 'chakra-react-select';
import { Override } from '@/utils/types';
import { ControlledInput } from './types';
import { FormCard } from './Form';
import { useController } from 'react-hook-form';
import { common } from '@/config/translations/common';


type Props = Override<
  SelectProps<Option, false>,
  {
    value?: string;
    onChange: (v: string) => void;
  }
>;

export const PeriodSelect = forwardRef<SelectInstance<Option, false>, Props>(
  ({ value, onChange, ...rest }, ref) => {
    const guild = useRouter().query.guild as string;
    const channelsQuery = useGuildChannelsQuery(guild);
    const isLoading = channelsQuery.isLoading;

    const selected = value != null ? channelsQuery.data?.find((c) => c.id === value) : null;

    return (
      <SelectField<Option>
        isDisabled={isLoading}
        isLoading={isLoading}
        placeholder={<common.T text="select period" />}
        options={[
            { value: 'YEARLY', label: 'Yearly' },
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'WEEKLY', label: 'Weekly' },
            { value: 'DAILY', label: 'Daily' },
            { value: 'HOURLY', label: 'Hourly' },
            { value: 'ONCE', label: 'Once' },
          ]}
        onChange={(e) => e != null && onChange(e.value)}
        ref={ref}
        {...rest}
      />
    );
  }
);

PeriodSelect.displayName = 'PeriodSelect';

export const PeriodSelectForm: ControlledInput<Omit<Props, 'value' | 'onChange'>> = ({
  control,
  controller,
  ...props
}) => {
  const { field, fieldState } = useController(controller);

  return (
    <FormCard {...control} error={fieldState.error?.message}>
      <PeriodSelect {...field} {...props} />
    </FormCard>
  );
};
