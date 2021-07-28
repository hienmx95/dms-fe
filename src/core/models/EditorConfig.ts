import { IImage } from 'components/ImageUpload/ImageUpload';
export class EditorConfig {
  public width?: number | string = '100%';
  public setup?: any;
  // tslint:disable-next-line:variable-name
  public content_style?: string;
  public height?: number | string = 50;
  public plugins?: string[];
  public toolbar?: boolean | string = false;
  public menubar?: boolean = false;
  public statusbar?: boolean = false;

  // tslint:disable-next-line:variable-name
  public images_upload_credentials?: boolean = true;
  // tslint:disable-next-line:variable-name
  public images_upload_handler?: (blobInfo: any, success?, failure?) => void;
  public imageUploader?: (blob: any) => Promise<IImage>;
  // tslint:disable-next-line:variable-name
  public entity_encoding?: string = 'raw';

  public placeholder?: string;
  constructor(
    width?: number | string,
    height?: number | string,
    toolbar?: boolean | string,
    menubar?: boolean,
    statusbar?: boolean,
    setup?: any,
    // tslint:disable-next-line:variable-name
    content_style?: string,
    plugins?: string[],
    imageUploader?: (blob: any) => Promise<IImage>,
    // tslint:disable-next-line:variable-name
    entity_encoding?: string,
    placeholder?: string,
  ) {
    this.width = width;
    this.height = height;
    this.plugins = plugins;
    this.toolbar = toolbar;
    this.menubar = menubar;
    this.statusbar = statusbar;
    this.content_style = content_style;
    this.setup = setup;
    this.imageUploader = imageUploader;
    // tslint:disable-next-line:variable-name
    this.images_upload_handler = this.imageUploadHandler;
    // tslint:disable-next-line:variable-name
    this.entity_encoding = entity_encoding;
    this.placeholder = placeholder;
  }

  private imageUploadHandler = (blobInfo: any, success) => {
    if (typeof this.imageUploader === 'function') {
      this.imageUploader(blobInfo.blob())
        .then((image: IImage) => {
          return image.url;
        })
        .then((url: string) => success(url));
    }
  };
}

export const defaultContentStyle: string =
         'body {font-size: 12px;line-height: 12px} .editor-tag-name{ color: #a32f4a;display: inline-block}';

export const aucompleteCallbackConfig = (fetch, onAction) => {
  return {
    ch: '@',
    minChars: 2,
    columns: 1,
    fetch,
    onAction,
  };
};

export const handleChangeMailTemplateOption = editor => {
  return (autocompleteApi, rng, value) => {
    /* inject html input with user data-id */
    const detail = value.split(';');
    const el = `<span class="editor-tag-name"><input type="hidden" data-id="${detail[1]}" />{{${detail[2]}}}</span><span>&#8203</span>`;
    editor.selection.setRng(rng);
    editor.insertContent(el);
    autocompleteApi.hide();
  };
};
