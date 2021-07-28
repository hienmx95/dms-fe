import React from 'react';
import { ImageViewType } from 'components/ImageView/ImageView';
export interface SwitchTypeButtonProps{
  isActive?: boolean;
  index?: number;
  onChange?: (type: string, index: number) => () => void;
  iconClass?: string;
  type?: ImageViewType;
}
function SwitchTypeButton(props: SwitchTypeButtonProps){
    const {isActive, onChange, index, iconClass, type} = props;
    return (
        <div
        className={`tex-danger change-type-btn d-flex align-items-center justify-content-center ${isActive ? 'active' : ''}`}
        onClick={onChange(type, index)}
      >
        <i className={iconClass} />
      </div>
    );
}

SwitchTypeButton.defaultProps = {
    className: '',
    isActive: false,
    index: 1,
    iconClass: '',
    type: 'thumb',
};

export default SwitchTypeButton;