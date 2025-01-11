export type AuthorData = {
    readonly name?: string
    readonly url?: string
    readonly icon_url?: string
}

export type FieldData = {
    readonly name?: string
    readonly value?: string
    readonly inline?: boolean
}
  
export type FooterData = {
    readonly text?: string
    readonly icon_url?: string
}

export type ImageData = {
    readonly url?: string
  }  

export type EmbedData = {
    readonly title?: string
    readonly description?: string
    readonly url?: string
    readonly timestamp?: string
    readonly color?: number | null
    readonly footer?: FooterData
    readonly image?: ImageData
    readonly thumbnail?: ImageData
    readonly author?: AuthorData
    readonly fields?: readonly FieldData[]
}

export type MessageData = {
    readonly content?: string | null
    readonly embeds?: readonly EmbedData[] | null
    readonly username?: string
    readonly avatar_url?: string
    readonly files?: readonly File[]
    readonly attachments?: readonly unknown[]
    readonly thread_name?: string | null
    readonly flags?: number
}