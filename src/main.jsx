import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Template from "./Template.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Template>
          <App />
      </Template>
  </StrictMode>
)
