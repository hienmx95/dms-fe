import Form from 'antd/lib/form';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { formService } from 'core/services/FormService';
import { OrganizationFilter } from 'models/OrganizationFilter';

import { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { WorkflowDefinition } from 'models/WorkflowDefinition';

const { Item: FormItem } = Form;

export interface IdFilterInputProps {
  value?: string | number | Moment | boolean | undefined;
  fieldName?: string;
  index?: number;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
  disabled?: boolean;
}

function IdFieldInput(props: IdFilterInputProps) {
  const [translate] = useTranslation();
  const { value, fieldName, index, contents, setContents, disabled } = props;

  /* filter */
  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const handleChange = React.useCallback(
    value => {
      if (contents) {
        contents[index] = { ...contents[index], value };
        setContents([...contents]);
      }
    },
    [contents, index, setContents],
  );

  const renderInput = React.useMemo(() => {
    return () => {
      if (fieldName) {
        switch (fieldName.trim()) {
          // OrganizationId, tree select dropdown
          case 'OrganizationId':
            return (
              <TreeSelectDropdown
                defaultValue={value ? +value : null}
                value={+value ? +value : null}
                mode="single"
                onChange={handleChange}
                modelFilter={organizationFilter}
                setModelFilter={setOrganizationFilter}
                getList={roleRepository.singleListOrganization}
                searchField={nameof(organizationFilter.name)}
                placeholder={translate('fields.placeholder.idType')}
                disabled={disabled}
              />
            );
        }
      }
    };
  }, [
    disabled,
    fieldName,
    handleChange,
    organizationFilter,
    translate,
    value,
  ]);

  return (
    <FormItem
      validateStatus={formService.getValidationStatus<any>(
        contents[index].errors,
        nameof(contents[index].value),
      )}
      help={contents[index].errors?.value}
    >
      {renderInput()}
    </FormItem>
  );
}

export default IdFieldInput;
