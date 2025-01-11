import React, { useEffect, useState } from "react";
import { useObserver } from "mobx-react-lite";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/layout";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ChannelSelectForm } from "../forms/ChannelSelect";
import { PeriodSelectForm } from "../forms/PeriodSelect";
import { SmallDatePickerForm } from "../forms/DatePicker";
import { SmallTimePickerForm } from "../forms/TimeSelect";
import { TextAreaForm } from "../forms/TextAreaForm";
import { useAnnouncementQuery, useEditAnnouncementMutation } from "@/api/hooks";
import { Announcement } from "@/config/types";

export type MessageEditorProps = {
    announcement: Announcement
    guild_id: string
    announcement_id: string
}

const schema = z.object({
  name: z.string(),
  channel_id: z.number(),
  message: z.string().min(20),
  period: z.string(),
  date: z.date(),
  time: z.string(),
});

type Input = z.infer<typeof schema>;


export function MessageEditor(props: MessageEditorProps) {
    dayjs.extend(customParseFormat);

    const [channel_id, set_channel_id] = useState(0)
    const [message, set_message] = useState("")
    const [name, set_name] = useState("")
    const [period, set_period] = useState("")
    const [date, set_date] = useState(dayjs().toDate())
    const [time, set_time] = useState(dayjs().format("HH:mm"))

    const { data: announcement, isLoading, refetch } = useAnnouncementQuery(props.guild_id, props.announcement_id);

    const { mutate: editAnnouncement, isLoading: isSaving } = useEditAnnouncementMutation();

    const { control, handleSubmit, setValue, reset } = useForm<Input>({
      resolver: zodResolver(schema),
      defaultValues: {
        channel_id: 0,
        name: "",
        message: "",
        period: "ONCE",
        date: dayjs().toDate(),
        time: "",
      },
    });

    useEffect(() => {
      if (announcement) {
        console.log(announcement)
        set_channel_id(announcement.channel_id)
        set_message(announcement.content)
        set_name(announcement.name)
        set_period(announcement.period)
        set_date(dayjs(announcement.timestamp).toDate())
        set_time(dayjs(announcement.timestamp).format("HH:mm"))

        setValue("channel_id", announcement.channel_id);
        console.log(announcement.channel_id)
        setValue("message", announcement.content);
        setValue("name", announcement.name);
        setValue("period", announcement.period);
        setValue("date", dayjs(new Date(announcement.timestamp * 1000)).toDate());
        setValue("time", dayjs(new Date(announcement.timestamp * 1000)).format("HH:mm"));
      }
    }, [announcement, reset, setValue]);

    const onSave = (data: Input) => {
      console.log(data)
      // Update only the mutable fields
      const updatedAnnouncement = {
        ...announcement, // Retain all immutable fields (e.g., user_id, guild_id, announcement_id)
        content: data.message,
        timestamp: data.date.toISOString(), // Convert `date` to ISO string
        period: data.period,
      };

      // Call the mutation to save the updated announcement
      editAnnouncement(
        { guild: announcement!.guild_id, announcement_id: announcement!.id, announcement: updatedAnnouncement },
        {
          onSuccess: () => {
            console.log("Announcement updated successfully");
          },
          onError: (error) => {
            console.error("Failed to update announcement:", error);
          },
        }
      );
    };

    return useObserver(() => (
      <Grid gap={12} background="navy.800" padding={10} borderRadius={20} templateRows="0fr 1fr 1fr 1fr 1fr 0fr" templateColumns="repeat(2, 1fr)">
        <GridItem rowSpan={1} colSpan={2} colStart={1} rowStart={1}>
          <Text fontSize="3xl" fontWeight="600" width={"100%"} textAlign={"center"}>{announcement!
          .name}</Text>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} colStart={1} rowStart={2}>
          <Controller
            name="channel_id"
            control={control}
            render={({ field }) => (
              <ChannelSelectForm
                control={{
                  label: "Channel",
                  description: "Where to send the welcome message",
                }}
                value={channel_id}
                onChange={(value) => {
                  console.log(value);
                  set_channel_id(value); 
                  field.onChange(value); 
                }}
                controller={{ control, name: "channel_id" }}
              />
            )}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} colStart={1} rowStart={3}>
          <PeriodSelectForm 
            control={{
              label: 'Period',
              description: 'How often the announcement is sent',
            }}
            controller={{ control, name: 'period' }}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} colStart={1} rowStart={4}>
          <SmallDatePickerForm 
            control={{
              label: 'Date',
              description: 'Date of schedule',
            }}
            controller={{ control, name: 'date' }}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} colStart={1} rowStart={5}>
          <SmallTimePickerForm 
            control={{
              label: 'Time',
              description: 'Time of announcement',
            }}
            controller={{ control, name: 'time' }}
          />
        </GridItem>
        <GridItem rowSpan={4} colSpan={1} rowStart={2} colStart={2}>
          <Flex h="full" w="full">
            <TextAreaForm
              control={{
                label: 'Message',
                description: 'Content of the announcement',
              }}
              controller={{ control, name: 'message' }}
              height="100%"
              width="100%"
              resize={"none"}
            />
          </Flex>
        </GridItem>
        <GridItem colSpan={2} colStart={2} rowStart={6} alignItems={"end"} alignContent={"end"} justifyContent={"end"} >
        <Flex justify={"end"}>
          <Button
            w="fit-content"
            variant="solid"
            onClick={handleSubmit(onSave)}
            isLoading={isSaving}
          >
            Save
          </Button>
        </Flex>
        </GridItem>
      </Grid>
    ))
}