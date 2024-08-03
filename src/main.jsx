import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Template from "./Template.jsx";
import RoutePages from "./RoutePages.jsx";
import ContextApp from "./ContextApp.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Template>
          <ContextApp>
            <RoutePages/>
          </ContextApp>
      </Template>
  </StrictMode>
)
