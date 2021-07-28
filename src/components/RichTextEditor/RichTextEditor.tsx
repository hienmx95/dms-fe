import { Editor } from '@tinymce/tinymce-react';
import React, { MutableRefObject } from 'react';
import { debounce } from 'core/helpers/debounce';
import './RichTextEditor.scss';

export interface TextEditorProps {
  value?: string;

  className?: string;

  editorConfig?: Record<string, any>;

  onChange?(value: string): void;

  id?: string;
}

const TextEditor = React.forwardRef(
  (props: TextEditorProps, ref: MutableRefObject<any>) => {
    const { value, onChange, editorConfig } = props;

    const handleChange = React.useCallback(
      debounce((...[content]: any) => {
        if (typeof onChange === 'function') {
          onChange(content);
        }
      }),
      [onChange],
    );

    return (
      <Editor
        ref={ref}
        apiKey="btweto7oo1j5i28zy9dgdruzdq11o6j2udeg394im1uygruk"
        value={value}
        onEditorChange={handleChange}
        plugins="wordcount"
        init={editorConfig}
      />
    );
  },
);

export default TextEditor;
