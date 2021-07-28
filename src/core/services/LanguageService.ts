import React from 'reactn';
import { GlobalState } from 'core/config';
import axios, { AxiosResponse } from 'axios';
import i18next from 'i18next';
import path from 'path';
import { LANGUAGE_ROUTE } from 'config/route-consts';

export class LanguageService {
  public useLanguage() {
    const [language] = React.useGlobal<GlobalState, 'language'>('language');
    const [, setLoading] = React.useGlobal<GlobalState, 'loading'>('loading');

    const handleChangeLanguage = React.useCallback(async () => {
      await setLoading(true);
      await axios
        .get(path.join(LANGUAGE_ROUTE, `${language}.json`))
        .then(async (response: AxiosResponse<any>) => {
          await i18next.addResources(language, '', response.data);
          await i18next.changeLanguage(language);
        });
    }, [language, setLoading]);

    React.useEffect(() => {
      handleChangeLanguage();
    }, [handleChangeLanguage]);
  }
}

export const languageService: LanguageService = new LanguageService();
