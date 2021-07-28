import { googleMapScriptBuilder } from 'config/consts';
import { routes } from 'config/routes';
import { i18nextConfig, initialGlobalState } from 'core/config';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import React from 'reactn';
import App from './core/components/App/App';
import * as serviceWorker from './serviceWorker';
import './styles';

Promise.all([
  React.setGlobal(initialGlobalState),
  i18next.use(initReactI18next).init(i18nextConfig),
]).then(() => {
  const googleMapScript = document.createElement('script'); // create scriptTag
  googleMapScript.src = googleMapScriptBuilder(
    process.env.REACT_APP_GOOGLE_APIKEY,
  ); // set scriptSource
  window.document.body.appendChild(googleMapScript); // append to body
  ReactDOM.render(
    <BrowserRouter>
      <App routes={routes} />
    </BrowserRouter>,
    document.getElementById('root'),
  );
});

serviceWorker.unregister();
