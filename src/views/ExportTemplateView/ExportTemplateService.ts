import { AxiosError } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelFilter } from '../../core/models/ModelFilter';
import { notification } from '../../helpers/notification';
export class ExportTemplateService {
  public useImport<TFilter extends ModelFilter>(
    onImport: (file: File, filter: TFilter) => Promise<void>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    filter?: TFilter,
  ): [
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    () => void,
    RefObject<HTMLInputElement>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    string,
    string,
  ] {
    const [translate] = useTranslation();
    const ref: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
      null,
    );
    const [errVisible, setErrVisible] = React.useState<boolean>(false);
    const [errorModel, setErrorModel] = React.useState<string>();
    const [fileName, setFileName] = React.useState<string>();

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
          const file: File = event.target.files[0];
          setLoading(true);
          onImport(file, filter)
            .then((fileSuss: any) => {
              setFileName(fileSuss?.fileName);
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
              notification.success({
                message: translate(generalLanguageKeys.update.requireRefresh),
              });
            })
            .catch((error: AxiosError<any>) => {
              setErrorModel(error.response.data);
              setErrVisible(true);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
      [filter, onImport, setLoading, translate],
    );

    const handleClick = React.useCallback(() => {
      ref.current.value = null;
    }, []);

    return [
      handleChange,
      handleClick,
      ref,
      errVisible,
      setErrVisible,
      errorModel,
      fileName,
    ];
  }
}

export const exportTemplateService: ExportTemplateService = new ExportTemplateService();
