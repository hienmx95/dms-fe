import React from 'react';
import './Input.scss';
import classNames from 'classnames';
import RichTextEditor from 'components/RichTextEditor/RichTextEditor';
import nameof from 'ts-nameof.macro';

export type InputType = 'text' | 'textarea' | 'editor';

export interface InputProps {
  type?: InputType;

  value?: string | number;

  className?: string;

  placeholder?: string;

  defaultValue?: string | number;

  onChange?(value?: string): void;

  onFocus?(event?: React.FocusEvent<any>): void;
}

function Input(props: InputProps) {
  const {
    type,
    value,
    defaultValue,
    onChange,
    onFocus,
    className,
    placeholder,
  } = props;

  const handleTextChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (typeof onChange === 'function') {
        onChange(event.target.value);
      }
    },
    [onChange],
  );

  const valueProps = React.useMemo(
    () => {
      if (props.hasOwnProperty(nameof(props.value))) {
        return {
          value: typeof value === 'string' ? value : '',
        };
      }
      return {
        defaultValue: typeof defaultValue === 'string' ? defaultValue : '',
      };
    },
    [defaultValue, props, value],
  );

  const htmlProps = {
    onFocus,
    placeholder,
    className: classNames('react3l-input form-control form-control-sm', className),
  };

  if (type === 'text') {
    return (
      <input type="text"
        {...valueProps}
        {...htmlProps}
        onChange={handleTextChange} />
    );
  }
  if (type === 'textarea') {
    return (
      <textarea
        {...valueProps}
        {...htmlProps}
        onChange={handleTextChange} />
    );
  }
  return (
    <RichTextEditor
      {...valueProps}
      className={className}
      onChange={onChange} />
  );
}

Input.defaultProps = {
  type: 'text',
};

export default Input;
