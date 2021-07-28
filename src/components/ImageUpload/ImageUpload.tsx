import * as React from 'react';
import './ImageUpload.scss';
import ImageUploadItem from './ImageUploadItem';
import { ImageUploadMethod } from './ImageUploadItem';
import { Moment } from 'moment';

export interface IImage {
  id?: number;
  name?: string;
  url?: string;
  thumbUrl?: string;
  originUrl?: string;
  createdAt?: Moment;
  updatedAt?: Moment;
  deletedAt?: Moment;
}

interface ImageUploadProps {
  defaultItems?: IImage[];
  defaultUrl?: string;
  limit?: number;
  aspectRatio?: number;
  onChange?: (images: IImage[]) => void;
  onUpload?: ImageUploadMethod;
}

function ImageUpload(props: ImageUploadProps) {
  const {
    onChange,
    onUpload,
    defaultItems,
    defaultUrl,
    limit,
    aspectRatio,
  } = props;

  const [items, setItems] = React.useState<IImage[]>([]);

  React.useEffect(() => {
    if (defaultItems) {
      setItems(defaultItems);
    }
  }, [setItems, defaultItems]);

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        if (defaultItems) {
          items.splice(index, 1);
          setItems([...items]);
          if (onChange) {
            onChange(items);
          }
        }
        if (defaultUrl) {
          setItems([]);
          if (onChange) {
            onChange(items);
          }
        }
      };
    },
    [defaultItems, defaultUrl, items, onChange],
  );

  const handleChange = React.useCallback(
    (index: number) => {
      return (imageFile: IImage) => {
        if (defaultItems) {
          items[index] = imageFile;
        } else {
          items[0] = imageFile;
        }
        const images: IImage[] = items.map((item: IImage) => {
          if (item && item.url) {
            return item;
          }
          return null;
        });
        setItems(images);
        if (onChange) {
          onChange(items);
        }
      };
    },
    [defaultItems, items, onChange],
  );

  const renderImages = React.useMemo(() => {
    let images = [];
    if (defaultItems) {
      // number of image you want to
      let previewCount = 0;
      if (items.length <= limit - 1) {
        previewCount = items.length;
      } else {
        previewCount = limit - 1;
      }
      for (let i: number = 0; i < previewCount + 1; i++) {
        images = [
          ...images,
          <React.Fragment key={i}>
            <ImageUploadItem
              defaultValue={items[i]}
              aspectRatio={aspectRatio}
              onDelete={handleDelete(i)}
              onChange={handleChange(i)}
              onUpload={onUpload}
            />
          </React.Fragment>,
        ];
      }
    }
    if (defaultUrl) {
      images = [
        ...images,
        <React.Fragment key={0}>
          <ImageUploadItem
            defaultValue={defaultUrl}
            aspectRatio={aspectRatio}
            onDelete={handleDelete(0)}
            onChange={handleChange(0)}
          />
        </React.Fragment>,
        <React.Fragment key={1}>
          <ImageUploadItem
            defaultValue={undefined}
            aspectRatio={aspectRatio}
            onDelete={handleDelete(1)}
            onChange={handleChange(1)}
          />
        </React.Fragment>,
      ];
    }
    if (!defaultUrl && !defaultItems) {
      images = [
        ...images,
        <React.Fragment key={0}>
          <ImageUploadItem
            defaultValue={items[0]}
            aspectRatio={aspectRatio}
            onDelete={handleDelete(0)}
            onChange={handleChange(0)}
            onUpload={onUpload}
          />
        </React.Fragment>,
      ];
    }
    return images;
  }, [
    aspectRatio,
    defaultItems,
    defaultUrl,
    handleChange,
    handleDelete,
    items,
    limit,
    onUpload,
  ]);

  return <div className="image-upload-list">{renderImages}</div>;
}

ImageUpload.defaultProps = {
  limit: 6,
  aspectRatio: 1,
};

export default ImageUpload;
