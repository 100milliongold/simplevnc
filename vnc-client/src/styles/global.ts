import { createGlobalStyle, css } from 'styled-components'

export default createGlobalStyle`
  ${({ theme }) => css`
    html {
      height: 100%;
      body {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 0;
        #root {
          display: flex;
          font-family: sans-serif;
          height: 100%;
          justify-content: center;
          align-items: center;
          padding: 15px;
        }
      }
    }
  `}
`