import styled from 'styled-components/macro'

const App = styled.div`
  display: grid;
  grid-template-rows: minmax(40px, max-content) minmax(0, 1fr) minmax(
      40px,
      max-content
    );
  width: 100%;
  height: 100%;
  border-radius: 12px;
`

export const Styled = {
  App,
}
