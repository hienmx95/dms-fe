import { Field } from 'models/Field';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import React from 'react';
import '.././RoleDetail.scss';
import DateFieldInput from './PermissionFieldInput/DateFieldInput';
import IdFieldInput from './PermissionFieldInput/IdFieldInput';
import LongFieldInput from './PermissionFieldInput/LongFieldInput';
import StringFieldInput from './PermissionFieldInput/StringFieldInput';
export interface PermissionFieldMappingTableProps {
  list?: Field[];
  selectedItems?: PermissionFieldMapping[];
  setSelectedItems?: (v: PermissionFieldMapping[]) => void;
}
function PermissionFieldMappingTable(props: PermissionFieldMappingTableProps) {
  const { list, selectedItems, setSelectedItems } = props;

  const handleChangeInput = React.useCallback(
    (field: Field, index: number, type: string) => {
      return (value: string | string[] | number[]) => {
        if (typeof value === 'object') {
          value = value.join(';');
        }
        if (setSelectedItems) {
          if (selectedItems.length > 0) {
            // find item match with fieldId
            const selectedItem = selectedItems.find(
              (item: PermissionFieldMapping, i: number) => {
                if (item.fieldId === field.id) {
                  index = i;
                  return true;
                }
                return false;
              },
            );
            // if selected Item existed, update it in content list
            if (selectedItem) {
              const updatedSelection = {
                ...selectedItem,
                value,
                fieldId: field.id,
                field,
              };
              selectedItems[index] = updatedSelection;
              setSelectedItems([...selectedItems]);
              return;
            }
          }
          // else create new selection in content list
          const newSelection = {
            value,
            type,
            fieldId: field.id,
            field,
          };
          setSelectedItems([...selectedItems, newSelection]);
          return;
        }
      };
    },
    [selectedItems, setSelectedItems],
  );

  return (
    <div className="field-table">
      {list &&
        list.map((item: Field, index: number) => {
          // define default value of each input based on currentItem
          let currentItem = new PermissionFieldMapping();
          let value = '';
          if (selectedItems.length > 0) {
            currentItem = selectedItems
              .filter(item => item)
              .find(i => i.fieldId === item.id);
            if (currentItem?.value) {
              value = currentItem.value;
            }
          }
          const type = item.type;
          switch (type) {
            case 'STRING': {
              return (
                <React.Fragment key={item.id}>
                  <span className="label-input ml-3">{item.name}</span>
                  <StringFieldInput
                    item={item}
                    handleList={handleChangeInput(item, index, type)}
                    value={value}
                  />
                </React.Fragment>
              );
            }
            case 'ID': {
              return (
                <React.Fragment key={item.id}>
                  {/* ignore field with name Id */}
                  {item.name.trim().toLowerCase() !== 'Id'.toLowerCase() && (
                    <>
                      <span className="label-input ml-3">{item.name}</span>
                      <IdFieldInput
                        item={item}
                        handleList={handleChangeInput(item, index, type)}
                        value={value}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            }
            case 'LONG': {
              return (
                <React.Fragment key={item.id}>
                  <span className="label-input ml-3">{item.name}</span>
                  <LongFieldInput
                    item={item}
                    handleList={handleChangeInput(item, index, type)}
                  />
                </React.Fragment>
              );
            }
            case 'DATE': {
              return (
                <React.Fragment key={item.id}>
                  <span className="label-input ml-3">{item.name}</span>
                  <DateFieldInput
                    item={item}
                    handleList={handleChangeInput(item, index, type)}
                    value={value}
                  />
                </React.Fragment>
              );
            }
            default:
              return null;
          }
        })}
    </div>
  );
}

export default PermissionFieldMappingTable;
