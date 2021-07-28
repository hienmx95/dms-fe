import { generalLanguageKeys } from 'config/consts';
import path from 'path';
import React from 'react';
import { useHistory } from 'react-router';
import { Id } from 'react3l';
import nameof from 'ts-nameof.macro';

export class RouterService {
  public useGoBack(masterRoute?: string): [() => void] {
    const history = useHistory();

    return [
      React.useCallback(() => {
        if (masterRoute) return history.push(masterRoute);
        return history.goBack();
      }, [history, masterRoute]),
    ];
  }

  public useMasterNavigation(
    baseRoute: string,
  ): [() => void, (id: Id) => () => void, (node: any) => () => void] {
    const history = useHistory();

    const handleGoCreate = React.useCallback(() => {
      history.push(
        path.join(baseRoute, nameof(generalLanguageKeys.actions.create)),
      );
    }, [baseRoute, history]);

    const handleGoCreateTree = React.useCallback(
      (node: any) => {
        return () => {
          history.push(
            path.join(
              baseRoute,
              nameof(generalLanguageKeys.actions.create) + `?id=${node.id}`,
            ),
          );
        };
      },
      [baseRoute, history],
    );

    const handleGoDetail = React.useCallback(
      (id: Id) => {
        return () => {
          history.push(path.join(baseRoute, `${id}`));
        };
      },
      [baseRoute, history],
    );

    return [
      handleGoCreate,
      handleGoDetail,
      handleGoCreateTree,
      //  handleCancel,
    ];
  }
}

export const routerService: RouterService = new RouterService();
