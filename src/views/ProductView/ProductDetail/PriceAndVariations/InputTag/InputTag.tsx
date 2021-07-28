import Tag from 'antd/lib/tag';
import React, { useState } from 'react';
import 'views/ProductView/ProductDetail/PriceAndVariations/InputTag/InputTag.scss';

interface IInputTagProps {
  defaultValue?: string[];

  value?: string[];

  onChange?: (value: string[]) => void;

  onRemove?: (value: string, index?: number) => void;

  onRemoveVariationGrouping?: () => void;

  onClear?: () => void;

  disabled?: boolean;

  max?: number;

  onClick?(): void;
  onRemoveVariation?(itemIndex: number): void;
}

function InputTag(props: IInputTagProps) {
  if (props.value && props.defaultValue) {
    throw new Error(
      'Component must be controlled or uncontrolled, but not both',
    );
  }

  const { max } = props;

  const [value, setValue] = useState<string[]>(props.defaultValue || []);

  const handleRemove = React.useCallback(
    (index: number) => {
      return () => {
        value.splice(index, 1);
        const newValue = [...value];
        if (props.onRemoveVariation) {
          props.onRemoveVariation(index);
        }
        setValue(newValue);
      };
    },
    [props, value],
  );

  const renderOutput = React.useCallback(
    (value: string[]) => {
      return (
        <div className="input-tag">
          <div className="flex-grow-1 d-flex">
            <button
              className="btn btn-sm btn-link"
              onClick={props.onClick}
              disabled={
                props.disabled ||
                (typeof max !== 'undefined' && value?.length >= max)
              }
            >
              <i className="fa fa-plus" />
            </button>
            <div className="list-tag flex-grow-1">
              {value.map((tag: string, index: number) => (
                <Tag
                  className="tag"
                  key={`${tag}-${index}`}
                  closable={!props.disabled}
                  onClose={handleRemove(index)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
          <div className="delete-all">
            <span
              onClick={props.onRemoveVariationGrouping}
              className="delete ml-3"
            >
              <i className="tio-delete_outlined" />
            </span>
          </div>
        </div>
      );
    },
    [
      handleRemove,
      max,
      props.disabled,
      props.onClick,
      props.onRemoveVariationGrouping,
    ],
  );

  if (props.value) {
    return renderOutput(props.value);
  }

  return renderOutput(value);
}

export default InputTag;
