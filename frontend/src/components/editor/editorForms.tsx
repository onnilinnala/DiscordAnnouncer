import {
    controlled,
    converters,
    Field,
    Form,
    Group,
    RepeatingForm,
    SubForm,
  } from "mstform"
import { EditorManager, EditorManagerLike } from "./Models"

export const matchesRegex = (regex: RegExp, error: string) => (value: string) =>
!value || regex.test(value) ? false : error

export const isUrl = () => matchesRegex(/^(?:https?:\/\/|[%{])/, "Invalid URL")

export const maxLength = (length: number) => (value: string) =>
    value.length > length ? `Exceeds maximum length of ${length}` : false

export const editorForm = new Form(EditorManager, {
    messages: new RepeatingForm({
        content: new Field(converters.string, {
        controlled: controlled.object,
        validators: [maxLength(2000)],
        }),
        embeds: new RepeatingForm(
        {
            title: new Field(converters.string, {
            controlled: controlled.object,
            validators: [maxLength(256)],
            }),
            description: new Field(converters.string, {
            controlled: controlled.object,
            validators: [maxLength(4096)],
            }),
            url: new Field(converters.string, {
            controlled: controlled.object,
            validators: [isUrl()],
            }),
            color: new SubForm({
            hue: new Field(converters.object),
            saturation: new Field(converters.object),
            value: new Field(converters.object),
            }),
            fields: new RepeatingForm({
            name: new Field(converters.string, {
                controlled: controlled.object,
                validators: [maxLength(256)],
                required: true,
            }),
            value: new Field(converters.string, {
                controlled: controlled.object,
                validators: [maxLength(1024)],
                required: true,
            }),
            inline: new Field(converters.boolean, {
                controlled: controlled.object,
            }),
            }),
            author: new Field(converters.string, {
            controlled: controlled.object,
            validators: [maxLength(256)],
            }),
            authorUrl: new Field(converters.string, {
            controlled: controlled.object,
            validators: [isUrl()],
            }),
            authorIcon: new Field(converters.string, {
            controlled: controlled.object,
            validators: [isUrl()],
            }),
            footer: new Field(converters.string, {
            controlled: controlled.object,
            validators: [maxLength(2048)],
            }),
            footerIcon: new Field(converters.string, {
            controlled: controlled.object,
            validators: [isUrl()],
            }),
            timestamp: new Field<Date, Date>(converters.object),
            gallery: new Field(converters.stringArray, {
            controlled: controlled.object,
            validators: [
                (value: string[]) => {
                const check = isUrl()
                return (
                    value
                    .map((value, index) =>
                        check(value)
                        ? `Image ${index + 1}: ${check(value)}`
                        : false,
                    )
                    .find(Boolean) ?? false
                )
                },
            ],
            }),
            thumbnail: new Field(converters.string, {
            controlled: controlled.object,
            validators: [isUrl()],
            }),
        },
        {
            body: new Group({ include: ["title", "description", "url", "color"] }),
            author: new Group({ include: ["author", "authorUrl", "authorIcon"] }),
            footer: new Group({ include: ["footer", "footerIcon", "timestamp"] }),
            fields: new Group({ include: ["fields"] }),
            images: new Group({ include: ["gallery", "thumbnail"] }),
        },
        ),
    }),
    })

export const createEditorForm = (state: EditorManagerLike) =>
editorForm.state(state, {
    backend: {
    save: async node => node.save(),
    process: async (node, path) => node.process(path),
    },
})

export type EditorFormState = typeof editorForm.FormStateType

const repeatingMessageItemFormState = (state: EditorFormState) =>
    state.repeatingForm("messages")
    export type RepeatingMessageItemFormState = ReturnType<
        typeof repeatingMessageItemFormState
    >

const messageItemFormState = (state: RepeatingMessageItemFormState) =>
    state.index(0)
    export type MessageItemFormState = ReturnType<typeof messageItemFormState>

const repeatingEmbedItemFormState = (state: MessageItemFormState) =>
    state.repeatingForm("embeds")
    export type RepeatingEmbedItemFormState = ReturnType<
        typeof repeatingEmbedItemFormState
    >

const embedItemFormState = (state: RepeatingEmbedItemFormState) =>
    state.index(0)
    export type EmbedItemFormState = ReturnType<typeof embedItemFormState>

const repeatingFieldItemFormState = (state: EmbedItemFormState) =>
    state.repeatingForm("fields")
    export type RepeatingFieldItemFormState = ReturnType<
     typeof repeatingFieldItemFormState
    >

const fieldItemFormState = (state: RepeatingFieldItemFormState) =>
    state.index(0)
    export type FieldItemFormState = ReturnType<typeof fieldItemFormState>

const repeatingTargetFormState = (state: EditorFormState) =>
    state.repeatingForm("messages")
    export type RepeatingTargetFormState = ReturnType<
        typeof repeatingTargetFormState
    >

const targetFormState = (state: RepeatingTargetFormState) => state.index(0)
    export type TargetFormState = ReturnType<typeof targetFormState>
