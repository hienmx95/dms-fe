import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import { notification } from 'helpers';
import { dataURIToFile } from 'helpers/data-uri-to-blob';
import React from 'react';
import Cropper from 'react-cropper';
import { useTranslation } from 'react-i18next';
import {
  Modal as RSModal,
  ModalBody as RSModalBody,
  ModalFooter as RSModalFooter,
} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import { IImage } from '../ImageUpload';
import './ImageUploadItem.scss';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { listAspectRatio } from 'config/consts';

export type ImageUploadMethod = (
  file: File,
  params?: { [key: string]: any },
) => Promise<IImage>;

interface ImageUploadItemProps {
  key?: string | number;
  defaultValue?: IImage | string;
  aspectRatio?: number;
  uploadText?: string;
  onChange?: (value: IImage) => void;
  onUpload?: ImageUploadMethod;
  onDelete?: (event?) => void;
  maxSizeEdge?: number;
}

export interface AspectRatio {
  name: string;
  value: number;
}

const cropperRef = React.createRef<any>();

function ImageUploadItem(props: ImageUploadItemProps) {
  const { defaultValue, onChange, onUpload, onDelete } = props;
  const [translate] = useTranslation();
  const [image, setImage] = React.useState<HTMLImageElement>(null);
  const [result, setResult] = React.useState<string>(null);
  const [file, setFile] = React.useState<File>(
    new File([], 'productImage', { lastModified: null }),
  );
  const [currentPreview, setCurrentPreview] = React.useState<string>(null);
  const [id] = React.useState<string>(uuidv4());
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>({
    name: '1',
    value: 1,
  });

  React.useEffect(() => {
    if (defaultValue && typeof defaultValue === 'object') {
      setResult(defaultValue?.url);
    }
    if (typeof defaultValue !== 'object') {
      setResult(defaultValue);
    }
  }, [setResult, defaultValue]);

  const handleChange = event => {
    if (event.target.files[0]) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const image: HTMLImageElement = new Image();
        image.src = reader.result.toString();
        setImage(image);
      };
      setFile(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setFile(null);
    }
    event.target.value = null;
  };

  const handleChangeAspectRatio = React.useCallback(
    (...[, item]) => {
      setAspectRatio({ ...item });
    },
    [setAspectRatio],
  );

  function handlePreview(url: string) {
    return () => {
      setCurrentPreview(url);
    };
  }

  const { cropper } = React.useMemo(() => {
    if (image) {
      return {
        cropper: (
          <Cropper
            src={image.src}
            aspectRatio={aspectRatio?.value}
            ref={cropperRef as any}
          />
        ),
        ratio: image.width / image.height,
      };
    }
    return {
      cropper: null,
      ratio: 1,
    };
  }, [image, aspectRatio]);

  const handleCrop = React.useCallback(() => {
    const result: string = cropperRef.current.cropper
      .getCroppedCanvas()
      .toDataURL();
    if (onUpload && file !== null) {
      const newFile: File = dataURIToFile(result, file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      onUpload(newFile)
        .then((imageFile: IImage) => {
          setResult(imageFile?.url);
          setImage(null);
          if (onChange) {
            onChange(imageFile);
          }
        })
        .catch((error: Error) => {
          notification.error({
            message: translate('components.upload.uploadError'),
            description: error.message,
          });
        });
    } else {
      // setResult(result);
      setImage(null);
      if (onChange) {
        const newImageFile: IImage = {
          name: file.name,
          url: result,
          originUrl: result,
          thumbUrl: result,
        };
        props.onChange(newImageFile);
      }
    }
  }, [file, onChange, onUpload, props, translate]);

  const handleDelete = React.useCallback(
    event => {
      setResult(null);
      setFile(null);
      if (onDelete) {
        onDelete(event);
      }
    },
    [onDelete],
  );

  const handleCancel = React.useCallback(() => {
    setImage(null);
    setResult(null);
  }, [setImage, setResult]);

  const handleClosePreview = React.useCallback(() => {
    if (currentPreview) {
      setCurrentPreview(null);
    }
  }, [currentPreview]);

  // let width: number;
  // let height: number;

  // if(maxSizeEdge){
  //   if (ratio < 1) {
  //     height = maxSizeEdge;
  //     width = Math.round(height * ratio);
  //   } else {
  //     width = maxSizeEdge;
  //     height = Math.round(width / ratio);
  //   }
  // }

  const inputFile = React.useMemo(
    () => <input type="file" id={id} onChange={handleChange} />,
    [id],
  );

  return (
    <div className="image-upload-item mr-2" key={props.key}>
      <Spin spinning={!!image} className="upload-image-item">
        {result ? (
          <div className="thumbnail">
            <img src={result} alt="" />
            <RSModal
              isOpen={!!currentPreview}
              backdrop
              toggle={handleClosePreview}
              className="image-upload-preview"
              onChange={handleClosePreview}
              unmountOnClose
            >
              <RSModalBody>
                <img src={currentPreview} alt="" />
              </RSModalBody>
            </RSModal>
            <div className="overlay">
              <Button
                htmlType="button"
                type="link"
                onClick={handlePreview(result)}
                className="view"
              >
                <Icon type="eye" />
              </Button>

              <Button
                htmlType="button"
                type="link"
                onClick={handleDelete}
                className="delete"
              >
                <Icon type="delete" />
              </Button>
            </div>
          </div>
        ) : (
          <label htmlFor={id} className="upload-button">
            <Icon type="plus" />
          </label>
        )}
        <RSModal isOpen={!!image} backdrop="static">
          <RSModalBody>
            <div className="cropper-container">{cropper}</div>
            <SelectAutoComplete
              defaultValue={listAspectRatio[0].id}
              list={listAspectRatio}
              placeholder={translate('images.placeholder.aspectRatio')}
              onChange={handleChangeAspectRatio}
              allowClear={false}
            />
          </RSModalBody>
          <RSModalFooter className="image-upload-modal-actions">
            <Button htmlType="button" type="primary" onClick={handleCrop}>
              {translate('general.actions.crop')}
            </Button>
            <Button htmlType="button" type="default" onClick={handleCancel}>
              {translate('general.actions.cancel')}
            </Button>
          </RSModalFooter>
        </RSModal>
        {inputFile}
      </Spin>
    </div>
  );
}

ImageUploadItem.defaultProps = {
  aspectRatio: 1,
  uploadText: 'Upload',
};

export default ImageUploadItem;
