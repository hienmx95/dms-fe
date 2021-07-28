import React, { Dispatch, SetStateAction } from 'react';
import { Model, ModelFilter } from 'core/models';
import './MultiSelect.scss';
import TreePopup from 'components/TreePopup/TreePopup';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import Truncate from 'react-truncate';

export interface MultiSelectProps<
  T extends Model,
  TModelFilter extends ModelFilter
  > {
  list?: T[];
  selectedItems?: T[];
  setSelectedItems?: Dispatch<SetStateAction<T[]>>;
  placeholder?: string;
  handleChangeTreePopup?: (selectedItem: T[]) => void;
  getList?: (filter: TModelFilter) => Promise<T[]>;
  searchField?: string;
  handleClose?: () => void;
  handleFocus?: () => void;
  modelFilter?: TModelFilter;
  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;
  visible?: boolean;
}

function MultiSelect<T extends Model, TModelFilter extends ModelFilter>(
  props: MultiSelectProps<T, TModelFilter>,
) {
  // props
  const {
    selectedItems,
    list,
    setSelectedItems,
    placeholder,
    handleChangeTreePopup,
    getList,
    searchField,
    handleClose,
    modelFilter,
    setModelFilter,
    visible,
    handleFocus,
  } = props;

  const handleRemoveItem = React.useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
      e.stopPropagation();
      selectedItems.splice(index, 1);
      setSelectedItems([...selectedItems]);
    },
    [selectedItems, setSelectedItems],
  );


  return (
    <div className="option-custom">
      <div className="form-control select-input" onClick={handleFocus}>
        {/* <div className="selected-list">
          {selectedItems.length > 0 &&
            selectedItems.map((item: T, index: number) => (
              <div
                className="selected-item"
                key={index}
                title={item === null ? '' : item.name}
              >
                <span key={index}>
                  <Truncate lines={1} ellipsis={'...'} width={100}>
                    {item === null ? placeholder : item.name}
                  </Truncate>
                </span>
                <span
                  onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
                    handleRemoveItem(e, index)
                  }
                >
                  x
                </span>
              </div>
            ))}
        </div> */}
        <PerfectScrollbar
          className="selected-list"
          options={{ useBothWheelAxes: false }}
        >
          {selectedItems?.length > 0 &&
            selectedItems.map((item: T, index: number) => (
              <div
                className="selected-item"
                key={index}
                title={item === null ? '' : item.name}
              >
                <span key={index}>
                  <Truncate lines={1} ellipsis={'...'} width={100}>
                    {item === null ? placeholder : item.name}
                  </Truncate>
                </span>
                <span
                  onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
                    handleRemoveItem(e, index)
                  }
                >
                  x
                </span>
              </div>
            ))}
        </PerfectScrollbar>
      </div>

      <TreePopup
        onChange={handleChangeTreePopup}
        getList={getList}
        list={list}
        modelFilter={modelFilter}
        setModelFilter={setModelFilter}
        searchField={searchField}
        selectedItems={selectedItems}
        visible={visible}
        onClose={handleClose}
      />
    </div>
  );
}

export default MultiSelect;
