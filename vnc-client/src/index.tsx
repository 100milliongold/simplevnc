import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyles  } from 'styles'


import { VNC } from "components";

import reportWebVitals from './core/reportWebVitals';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <GlobalStyles/>
      <VNC />
    </React.StrictMode>
  </ThemeProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
