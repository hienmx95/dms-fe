import { Model } from 'core/models';
import { ErrorMap } from 'react3l';
import React from 'react';

export class FormService {
  public getValidationStatus<T extends Model>(
    errors: ErrorMap<T>,
    field: string,
  ) {
    if (typeof errors === 'object' && errors !== null) {
      if (errors.hasOwnProperty('field')) {
        if (typeof errors[field] === 'string' && errors[field] !== '') {
          return 'error';
        }
      }
    }
    return '';
  }

  public useValidateStatus<T extends Model>(
    errors: ErrorMap<T>,
  ): [(field: string) => '' | 'error'] {
    const getError = React.useMemo(() => {
      return (field: string) => {
        // tslint:disable-next-line:no-console
        console.log(field);
        if (typeof errors === 'object' && errors !== null) {
          if (errors.hasOwnProperty('Code')) {
            if (typeof errors.Code === 'string' && errors.Code !== '') {
              return 'error';
            }
          }
        }
        return '';
      };
    }, [errors]);

    return [getError];
  }
}

export const formService: FormService = new FormService();
