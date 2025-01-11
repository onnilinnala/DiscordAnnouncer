import styled from "styled-components"

export const ButtonRow = styled.div`
  display: grid;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
  column-gap: 12px;
`

export const ModalFooter = styled(ButtonRow)`
  justify-content: end;

  background: ${({ theme }) => theme.background.secondary};
  border-radius: 0 0 4px 4px;

  padding: 16px;
`
