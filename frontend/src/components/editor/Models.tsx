import { getParentOfType, Instance, SnapshotOrInstance, types } from "mobx-state-tree"
import { isValid } from "date-fns"
import { AuthorData, FieldData, FooterData, ImageData, EmbedData, MessageData } from './Types'

const colorValue = types.custom<number | null, number>({
    name: "ColorValue",
    fromSnapshot(value) {
      return value ?? Number.NaN
    },
    toSnapshot(value) {
      return Number.isNaN(value) ? null : value
    },
    isTargetType(value) {
      return typeof value === "number"
    },
    getValidationMessage(value: unknown) {
      if (typeof value === "number" || value === null) return ""
      return "Value is not a number or null"
    },
  })

export const ColorModel = types
  .model("ColorModel", {
    hue: types.optional(colorValue, Number.NaN),
    saturation: types.optional(colorValue, Number.NaN),
    value: types.optional(colorValue, Number.NaN),
  })
  .views(self => ({
    get valid() {
      return ![self.hue, self.saturation, self.value].some(n => Number.isNaN(n))
    },

    get raw() {
      if (!this.valid) return null

      const f = (n: number) => {
        const k = (n + self.hue / 60) % 6

        return (
          self.value -
          self.value * self.saturation * Math.max(Math.min(k, 4 - k, 1), 0)
        )
      }

      return (
        // red
        Math.round(f(5) * 255) * 0x010000 +
        // green
        Math.round(f(3) * 255) * 0x000100 +
        // blue
        Math.round(f(1) * 255)
      )
    },

    get hex() {
      if (!this.valid) return
      return `#${this.raw?.toString(16).padStart(6, "0")}`
    },
  }))
  .actions(self => ({
    invalidate() {
      self.hue = Number.NaN
      self.saturation = 0
      self.value = 0
    },

    setHue(value: number) {
      self.hue = value
    },
    setSaturation(value: number) {
      self.saturation = value
    },
    setValue(value: number) {
      self.value = value
    },

    setRaw(value: number | null) {
      this.setHex(
        typeof value === "number"
          ? `#${value.toString(16).padStart(6, "0")}`
          : "",
      )
    },

    setHex(hex: string) {
      if (!hex) {
        this.invalidate()
        return
      }

      const [, red = 0, green = 0, blue = 0] =
        /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i
          .exec(hex)
          ?.map(hex => Number.parseInt(hex, 16)) ?? []

      const max = Math.max(red, blue, green)
      const min = Math.min(red, blue, green)
      const delta = max - min

      const value = max / 255
      const saturation = max && (max - min) / max

      let hue = 0
      if (max === red) hue = 60 * ((green - blue) / delta)
      if (max === green) hue = 60 * (2 + (blue - red) / delta)
      if (max === blue) hue = 60 * (4 + (red - green) / delta)
      if (delta === 0) hue = 0

      if (hue < 0) hue += 360

      self.hue = hue
      self.saturation = saturation
      self.value = value
    },
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface ColorLike extends Instance<typeof ColorModel> {}

export const FieldModel = types
  .model("FieldModel", {
    name: "",
    value: "",
    inline: false,
  })
  .views(self => ({
    get embed(): EmbedLike {
      return getParentOfType(self, EmbedModel)
    },

    get displayName() {
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
      return (
        self.name
          .split("\n")
          .map(line => line.trim())
          .find(Boolean) ||
        self.value
          .split("\n")
          .map(line => line.trim())
          .find(Boolean) ||
        undefined
      )
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    },
  }))
  .actions(self => ({
    set<K extends keyof typeof self>(
      key: K,
      value: SnapshotOrInstance<typeof self[K]>,
    ): void {
      self[key] = value
    },
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface FieldLike extends Instance<typeof FieldModel> {}

export const nullableDate = types.custom<Date | number | null, Date>({
    name: "NullableDate",
    fromSnapshot(value) {
      return new Date(value ?? Number.NaN)
    },
    toSnapshot(value) {
      const time = value.getTime()
      return Number.isNaN(time) ? null : time
    },
    isTargetType(value) {
      return value instanceof Date
    },
    getValidationMessage(value: unknown) {
      if (value instanceof Date) return ""
      if (typeof value === "number") return ""
      if (value === null) return ""
  
      return "Value is not a Date, a unix milliseconds timestamp, or null"
    },
  })
  

export const EmbedModel = types
  .model("EmbedModel", {
    title: "",
    description: "",
    url: "",
    color: types.optional(ColorModel, {}),
    fields: types.array(types.late(() => FieldModel)),
    author: "",
    authorUrl: "",
    authorIcon: "",
    footer: "",
    footerIcon: "",
    timestamp: types.optional(nullableDate, null),
    gallery: types.array(types.string),
    thumbnail: "",
  })
  .views(self => ({
    get message(): MessageLike {
      return getParentOfType(self, MessageModel)
    },

    get length() {
      return (
        self.title.length +
        self.description.length +
        self.fields.reduce(
          (length, field) => length + field.name.length + field.value.length,
          0,
        ) +
        self.author.length +
        self.footer.length
      )
    },

    get size() {
      return Math.max(self.gallery.length, 1)
    },

    get hasTitle() {
      return self.title.trim().length > 0
    },
    get hasDescription() {
      return self.description.trim().length > 0
    },
    get hasAuthor() {
      return self.author.trim().length > 0
    },
    get hasFooter() {
      return self.footer.trim().length > 0 || isValid(self.timestamp)
    },

    get data(): readonly EmbedData[] {
      const fields: FieldData[] | undefined =
        self.fields.length > 0
          ? self.fields.map(field => ({
              name: field.name || undefined,
              value: field.value || undefined,
              inline: field.inline || undefined,
            }))
          : undefined

      const author: AuthorData | undefined = this.hasAuthor
        ? {
            name: self.author,
            url: self.authorUrl || undefined,
            icon_url: self.authorIcon || undefined,
          }
        : undefined

      const footer: FooterData | undefined =
        self.footer.trim().length > 0 ||
        (isValid(self.timestamp) && self.footerIcon)
          ? {
              text: self.footer || undefined,
              icon_url: self.footerIcon || undefined,
            }
          : undefined

      const embeds: EmbedData[] = [
        {
          title: self.title || undefined,
          description: self.description || undefined,
          url: self.url || undefined,
          color: self.color.raw,
          fields,
          author,
          footer,
          timestamp: isValid(self.timestamp)
            ? self.timestamp.toJSON()
            : undefined,
          image: self.gallery.length > 0 ? { url: self.gallery[0] } : undefined,
          thumbnail: self.thumbnail ? { url: self.thumbnail } : undefined,
        },
      ]

      for (const image of self.gallery.slice(1)) {
        embeds.push({
          url: self.url,
          image: { url: image },
        })
      }

      return embeds
    },

    get displayName() {
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
      return (
        self.author
          .split("\n")
          .map(line => line.trim())
          .find(Boolean) ||
        self.title
          .split("\n")
          .map(line => line.trim())
          .find(Boolean) ||
        self.description
          .split("\n")
          .map(line => line.trim())
          .find(Boolean) ||
        self.fields.map(field => field.displayName).find(Boolean) ||
        self.footer
          .split("\n")
          .map(line => line.trim())
          .find(Boolean) ||
        undefined
      )
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    },
  }))
  .actions(self => ({
    set<K extends keyof typeof self>(
      key: K,
      value: SnapshotOrInstance<typeof self[K]>,
    ) {
      self[key] = value
    },
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface EmbedLike extends Instance<typeof EmbedModel> {}

export const stringifyMessage = (message: MessageData, pretty = true) => {
    return JSON.stringify(
      { ...message, files: undefined },
      undefined,
      pretty ? 2 : undefined,
    )
}

export const MessageModel = types
  .model("MessageModel", {
    content: "",
    username: "Junction Announcer",
    avatar: "https://cdn.discordapp.com/app-icons/1320744210240114688/6b4d4e3c90fc3d0b6897b7890721cc37.png?size=256",
    embeds: types.array(types.late(() => EmbedModel)),
    thread_name: types.optional(types.string, ""),
    reference: "",
    timestamp: types.optional(nullableDate, null),
    badge: types.optional(types.maybeNull(types.string), "Bot"),
    flags_suppress_embeds: types.optional(types.boolean, false),
    flags_suppress_notifications: types.optional(types.boolean, false), // silent
  })
  .volatile(() => ({
    files: [] as readonly File[],
  }))
  .views(self => ({
    get hasContent() {
      return self.content.trim().length > 0
    },
    get hasExtras() {
      return self.embeds.length > 0 || self.files.length > 0
    },

    get embedLength() {
      return self.embeds.reduce((size, embed) => size + embed.length, 0)
    },

    get size() {
      return self.embeds.reduce((size, embed) => size + embed.size, 0)
    },

    get data(): MessageData {
      const embeds = self.embeds.flatMap(embed => embed.data)

      let flags = 0
      if (self.flags_suppress_embeds) {
        flags |= 1 << 2
      }
      if (self.flags_suppress_notifications) {
        flags |= 1 << 12
      }

      return {
        content: self.content || null,
        embeds: embeds.length > 0 ? embeds : null,
        username: self.username || undefined,
        avatar_url: self.avatar || undefined,
        files: self.files.length > 0 ? Array.from(self.files) : undefined,
        attachments: self.files.length === 0 ? [] : undefined,
        thread_name: self.thread_name || undefined,
        flags: flags === 0 ? undefined : flags,
      }
    },

    get body() {
      const json = stringifyMessage(this.data, false)

      if (self.files.length > 0) {
        const formData = new FormData()

        if (json !== "{}") formData.append("payload_json", json)

        for (const [index, file] of self.files.entries()) {
          formData.append(`file[${index}]`, file, file.name)
        }

        return formData
      }

      return json
    },
  }))
  .actions(self => ({
    set<K extends keyof typeof self>(
      key: K,
      value: SnapshotOrInstance<typeof self[K]>,
    ): void {
      self[key] = value
    },
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface MessageLike extends Instance<typeof MessageModel> {}

export const EditorManager = types
  .model("EditorManager", {
    messages: types.array(types.late(() => MessageModel)),
  })
  .actions(self => ({
    set<K extends keyof typeof self>(
      key: K,
      value: SnapshotOrInstance<typeof self[K]>,
    ) {
      self[key] = value
    },

    clear() {
      self.messages.clear()
      self.messages.push(MessageModel.create())
    },
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface EditorManagerLike extends Instance<typeof EditorManager> {}
