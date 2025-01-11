import { useObserver } from "mobx-react-lite"
import { applySnapshot } from "mobx-state-tree"
import React, { ChangeEvent, useState } from "react"
import styled from "styled-components"
import { Button, Input } from '@chakra-ui/react';
import { ModalAction } from "./layout/ModalAction"
import { ModalBody } from "./layout/ModalBody"
import { ModalContainer } from "./layout/ModalContainer"
import { ModalFooter } from "./layout/ModalFooter"
import { ModalHeader } from "./layout/ModalHeader"
import { ModalTitle } from "./layout/ModalTitle"
import { ModalContext } from "./ModalContext"
import { useRequiredContext } from "@/utils/form"
import { remove } from "@/icons/remove"
import { messageOf, stringifyMessage } from "@/components/announcement/Message"
import type { MessageLike } from "@/components/editor/Models"
import { isMessage, copyTextToClipboard } from "@/components/announcement/Message"


type JsonType =
  | string
  | number
  | boolean
  | null
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  | { [key: string]: JsonType | undefined }
  | JsonType[]

const parseJson = (json: string) => {
    try {
      return { value: JSON.parse(json) as JsonType }
    } catch (error) {
      const message = error.message.replace(/^JSON\.parse: /, "")
      return { error: message as string }
    }
  }
  

const Container = styled(ModalContainer)`
  width: 1024px;
  height: 768px;

  display: flex;
  flex-flow: column;
`

const Body = styled(ModalBody)`
  flex: 1;

  display: flex;
  flex-flow: column;
`

const CodeInput = styled(Input)`
  && {
    width: 100%;
    resize: none;
  }

  flex: 1;

  font-family: ${({ theme }) => theme.font.mono};
  font-size: 14px;
  line-height: 1.375;

  overflow-y: auto;
`

const ErrorContainer = styled.div`
  margin-top: 8px;

  max-height: max(20%, 96px);
  overflow-y: auto;
`

const ErrorLine = styled.code`
  display: block;

  color: ${({ theme }) => theme.accent.danger};
  font-size: 14px;
  line-height: 1.375;

  & + & {
    margin-top: 8px;
  }
`

export type DataEditorModalProps = {
  message: MessageLike
}

export function DataEditorModal(props: DataEditorModalProps) {
  const { message } = props

  const modal = useRequiredContext(ModalContext)

  const [value, setValue] = useState(() => stringifyMessage(message.data))

  const { value: data, error } = parseJson(value)
  const errors = error ? [error] : isMessage(data, "$")

  return useObserver(() => (
    <Container>
      <ModalHeader>
        <ModalTitle>JSON Editor</ModalTitle>
        <ModalAction
          icon={remove}
          label="Close"
          onClick={() => modal.dismiss()}
        />
      </ModalHeader>
      <Body>
        <CodeInput
          as="textarea"
          id="data-editor"
          value={value}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setValue(event.target.value)
          }}
        />
        {errors.length > 0 && (
          <ErrorContainer>
            {errors.map((error, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <ErrorLine key={index}>{error}</ErrorLine>
            ))}
          </ErrorContainer>
        )}
      </Body>
      <ModalFooter>
        <Button onClick={() => copyTextToClipboard(value)}>
          Copy to Clipboard
        </Button>
        <Button onClick={() => modal.dismiss()}>
          Cancel
        </Button>
        <Button
          disabled={errors.length > 0}
          onClick={() => {
            applySnapshot(message, {
              ...messageOf(JSON.parse(value)),
            })
            modal.dismiss()
          }}
        >
          Apply Changes
        </Button>
      </ModalFooter>
    </Container>
  ))
}
