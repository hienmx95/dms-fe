import React from 'react';
import { Model } from 'core/models';
import Tag from 'antd/lib/tag';
export interface IdSelectedTagProps<T extends Model> {
    key?: string | number;
    item: T;
    onRemove?: (id: number) => () => void;
    disabled?: boolean;
}
function IdSelectedTag<T extends Model>(props: IdSelectedTagProps<T>) {
    const { key, item, onRemove, disabled } = props;

    return (<>
        <Tag
            className="tag"
            key={key}
            closable={!disabled}
            onClose={onRemove(item.id)}
        >
            {item?.name || item?.displayName}
        </Tag>
    </>);
}

export default IdSelectedTag;