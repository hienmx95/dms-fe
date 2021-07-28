import { AxiosError } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import { translate } from 'core/helpers/internationalization';
import { Model } from 'core/models';
import { SystemConfiguration } from 'models/SystemConfiguration';
import React from 'react';
import { notification } from '../../helpers/notification';
// import { useEffect } from 'reactn';
export class SystemConfigurationService {
    public useSystemConfig<T extends Model>(
        modelClass: new () => T,
        get: () => Promise<T>,
        update: (item: SystemConfiguration) => Promise<T>,
    ){
        const [config, setConfig] = React.useState<T>(new modelClass());
        const [backConfig, setBackConfig] = React.useState<T>(new modelClass());
        React.useEffect(()=>{
            get().then(data=>{
                setConfig(data);
                setBackConfig(data);
            });
        },[get]);


        const handleChangeSwitch = React.useCallback((field: string) => {
            return (checked: boolean ) => {
              setConfig({
                  ...config,
                  [field]: checked,
              });
            };
          }, [config,setConfig]);

        const handleChangeRadio1 = React.useCallback(
            event => {
              const radio: number = event.target.value;
              setConfig({
                  ...config,
                  prioritY_USE_PRICE_LIST: radio,
              });
            },
            [config, setConfig],
          );
          const handleChangeRadio2 = React.useCallback(
            event => {
              const radio: number = event.target.value;
              setConfig({
                  ...config,
                  prioritY_USE_PROMOTION: radio,
              });
            },
            [config, setConfig],
          );
          const handleSave = React.useCallback(()=>{
            update(config)
                .then((data)=>{
                    setConfig(data);
                    setBackConfig(data);
                    notification.success({
                        message: translate(generalLanguageKeys.update.success),
                      });
                })
                .catch((error: AxiosError<T>) => {
                    notification.error({
                      message: translate(generalLanguageKeys.update.error),
                      description: error.message,
                    });
                  });
          },[config,update]);

          const handleCancel = React.useCallback(()=>{
            setConfig(backConfig);
          },[backConfig]);

        return {config,setConfig, handleChangeSwitch,handleChangeRadio1,handleChangeRadio2,handleSave, handleCancel};
    }
}
export const systemConfigurationService: SystemConfigurationService = new SystemConfigurationService();