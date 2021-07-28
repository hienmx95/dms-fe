import AntInput from 'antd/lib/input';
import classNames from 'classnames';
import 'components/AdvancedStringFilter/AdvancedStringFilter.scss';
import { ModelFilter } from 'core/models';
import React, {
  ChangeEvent,
  Dispatch, RefObject,
  SetStateAction,
} from 'react';

export interface AdvancedStringFilterProps<TModelFilter extends ModelFilter> {
  filter: TModelFilter;
  filterField?: string;
  onChange?(filter: TModelFilter, filterField: string);
  placeholder?: string;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
}

function AdvancedStringNoTypeFilter<TModelFilter extends ModelFilter>(props: AdvancedStringFilterProps<TModelFilter>) {
  const {
    filter,
    filterField,
    onChange,
    placeholder,
    isReset,
    setIsReset,
  } = props;

  const ref: RefObject<AntInput> = React.useRef<AntInput>(null);
  const [value, setValue] = React.useState<string>(null);
  React.useEffect(() => {
    if (typeof filter[filterField] === 'undefined') {
      filter[filterField] = '';
      setValue('');
    } else {
      ref.current.setState({
        value: filter[filterField],
      });
      setValue(filter[filterField]);
    }
  }, [filter, filterField]);



  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      filter[filterField] = event.target.value;
      if (event.target.value === '' && typeof onChange === 'function') {
        onChange(filter, filterField);
      }
    },
    [filter, filterField, onChange],
  );

  React.useEffect(() => {
    if (isReset) {
      filter[filterField] = '';
      ref.current.setState({
        value: '',
      });
      onChange(filter, filterField);
      setIsReset(false);
    }
  }, [filter, filterField, isReset, onChange, setIsReset]);

  const handlePressEnter = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && typeof onChange === 'function') {
        onChange(filter, filterField);
      }
    },
    [onChange, filter, filterField],
  );


  return (
    <>
      <AntInput
        type="text"
        ref={ref}
        className={classNames('advanced-string-filter')}
        placeholder={placeholder}
        defaultValue={value || ''}
        size="small"
        onKeyPress={handlePressEnter}
        onChange={handleChange}
      />
    </>

  );
}

export default AdvancedStringNoTypeFilter;
