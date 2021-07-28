/* this file is a temp for AvartarUploader and will replace AvartarUploader soon */
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import React from 'react';
import Cropper from 'react-cropper';
import { useTranslation } from 'react-i18next';
import {
  Modal as RSModal,
  ModalBody as RSModalBody,
  ModalFooter as RSModalFooter,
} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import { Moment } from 'moment';
import { dataURIToFile } from 'helpers/data-uri-to-blob';
import { notification } from 'helpers';
import './ShowingCategoryImageUploader.scss';

export type ImageUploadMethod = (
  file: File,
  params?: { [key: string]: any },
) => Promise<IImage>;

export interface IImage {
  id?: number;
  name?: string;
  url?: string;
  thumbnailUrl?: string;
  originUrl?: string;
  createdAt?: Moment;
  updatedAt?: Moment;
  deletedAt?: Moment;
}

interface ImageUploadItemProps {
  key?: string | number;
  defaultValue?: IImage | string;
  aspectRatio?: number;
  uploadText?: string;
  onChange?: (value: IImage) => void;
  onDelete?: (event?) => void;
  maxSizeEdge?: number;
  onUpload?: ImageUploadMethod;
}

/* cropper ref */
const cropperRef = React.createRef<any>();
const aspectRatio = {
  name: '1',
  value: 1,
};

function CategoryImageUploader(props: ImageUploadItemProps) {
  const { defaultValue, onChange, onUpload } = props;
  const [translate] = useTranslation();
  const [image, setImage] = React.useState<any>(null);
  const [result, setResult] = React.useState<string>(null);
  const [file, setFile] = React.useState<File>(
    new File([], 'productImage', { lastModified: null }),
  );
  const [currentPreview, setCurrentPreview] = React.useState<string>(null);
  const [id] = React.useState<string>(uuidv4());

  React.useEffect(() => {
    if (defaultValue && typeof defaultValue === 'object') {
      setResult(defaultValue?.url);
    } else {
      setResult(defaultValue as string);
    }
  }, [defaultValue]);

  /* handleChange file*/
  const handleChange = event => {
    if (event.target.files[0]) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const image = new Image();
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

  /* handleOpen preview */
  const handlePreview = (url: string) => {
    return () => {
      setCurrentPreview(url);
    };
  };

  /* cropper */
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
  }, [image]);

  /* handleCrop */
  const handleCrop = React.useCallback(() => {
    const result: string = cropperRef.current.cropper
      .getCroppedCanvas()
      .toDataURL();
    if (onChange && file !== null) {
      const newFile: File = dataURIToFile(result, file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      if (onUpload) {
        onUpload(newFile)
          .then((image: IImage) => {
            setResult(image.url);
            setImage(null);
            if (onChange) onChange(image);
          })
          .catch((error: Error) => {
            notification.error({
              message: translate('components.upload.uploadError'),
              description: error.message,
            });
          });
      }
    }
  }, [onChange, file, onUpload, translate, setResult]);

  /* handleCancel */
  const handleCancel = React.useCallback(() => {
    setImage(null);
    setResult(null);
  }, [setImage, setResult]);

  /* handleClosePreview */
  const handleClosePreview = React.useCallback(() => {
    if (currentPreview) {
      setCurrentPreview(null);
    }
  }, [currentPreview]);

  /* input */
  const inputFile = React.useMemo(
    () => (
      <input
        type="file"
        id={id}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    ),
    [id],
  );

  return (
    <div className="avatar-uploader" key={props.key}>
      <Spin spinning={!!image} className="upload-image-item">
        <React.Fragment>
          <div className="d-flex">
            {result && (
              <div className="thumbnail mb-2 mr-4">
                <img src={result} alt="" width={70} />
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
                  >
                    <Icon type="eye" />
                  </Button>
                </div>
              </div>
            )}
            <div className="d-flex align-items-center">
              <label
                className="d-flex align-items-center justify-content-center upload-button"
                htmlFor={id}
              >
                {result
                  ? translate('images.placeholder.changeImage')
                  : translate('images.placeholder.uploadImage')}
              </label>
            </div>
          </div>
        </React.Fragment>

        <RSModal isOpen={!!image} backdrop="static">
          <RSModalBody>
            <div className="cropper-container">{cropper}</div>
          </RSModalBody>
          <RSModalFooter className="image-upload-modal-actions">
            <Button
              htmlType="button"
              type="primary"
              onClick={handleCrop}
              className="btn-crop"
            >
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

export default CategoryImageUploader;
