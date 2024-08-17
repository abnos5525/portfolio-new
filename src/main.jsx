import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Template from "./template/Template.jsx";
import RoutePages from "./RoutePages.jsx";
import ContextApp from "./ContextApp.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";
import global_en from "./langs/en/global.json"
import global_fa from "./langs/fa/global.json"

i18next
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: global_en
            },
            fa: {
                translation: global_fa
            },
            lng: 'fa', // Set default language here
            fallbackLng: 'fa', // Fallback language
        }
    })

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ContextApp>
          <I18nextProvider i18n={i18next}>
              <Template>
                    <RoutePages/>
              </Template>
          </I18nextProvider>
      </ContextApp>
  </StrictMode>
)
