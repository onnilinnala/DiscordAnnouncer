import { Context, useContext } from "react"

export const matchesRegex = (regex: RegExp, error: string) => (value: string) =>
    !value || regex.test(value) ? false : error
  

export const isUrl = () => matchesRegex(/^(?:https?:\/\/|[%{])/, "Invalid URL")

export const maxLength = (length: number) => (value: string) =>
    value.length > length ? `Exceeds maximum length of ${length}` : false

export const useRequiredContext = <T>(context: Context<T>) => {
    const value = useContext(context)
  
    if (value == null) {
      const displayName = context.displayName ?? "(unknown context)"
      throw new Error(`${displayName} is not available in the component tree.`)
    }
  
    return value as Exclude<T, undefined | null>
}