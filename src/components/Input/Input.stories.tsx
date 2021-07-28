import React from 'react';
import nameof from 'ts-nameof.macro';
import Input, {InputType} from 'components/Input/Input';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import classNames from 'classnames';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/jsx/jsx';

export default {
  title: nameof(Input),
};

function Text() {
  return (
    <Input type="text" className="mb-2"/>
  );
}

Text.toString = () => {
  return 'function Text() {\n' +
    '  return (\n' +
    '    <Input type="text"/>\n' +
    '  );\n' +
    '}';
};

function TextArea() {
  return (
    <Input type="textarea" className="mb-2"/>
  );
}

TextArea.toString = () => {
  return 'function TextArea() {\n' +
    '  return (\n' +
    '    <Input type="textarea"/>\n' +
    '  );\n' +
    '}';
};

function Editor() {
  return (
    <Input type="editor" className="mb-2"/>
  );
}

Editor.toString = () => {
  return 'function Editor() {\n' +
    '  return (\n' +
    '    <Input type="editor"/>\n' +
    '  );\n' +
    '}';
};

const types = {
  'text': Text,
  'textarea': TextArea,
  'editor': Editor,
};

export function Examples() {
  const [type, setType] = React.useState<InputType>('text');
  const [value, setValue] = React.useState<string>('');

  const handleChange = React.useCallback(
    (event) => {
      setType(event.target.value as InputType);
    },
    [],
  );

  return (
    <>
      <div className="h3">
        Type switching:
      </div>
      <ButtonGroup className="mb-2">
        <button className={classNames('btn btn-sm btn-primary', {active: type === 'text'})}
                value="text"
                onClick={handleChange}>
          text
        </button>
        <button className={classNames('btn btn-sm btn-primary', {active: type === 'textarea'})}
                value="textarea"
                onClick={handleChange}>
          textarea
        </button>
        <button className={classNames('btn btn-sm btn-primary', {active: type === 'editor'})}
                value="editor"
                onClick={handleChange}>
          editor
        </button>
      </ButtonGroup>
      <div className="h3">
        Demo:
      </div>
      <Input type={type} value={value} onChange={setValue} className="mb-2"/>
      <div className="h3">
        Code:
      </div>
      <CodeMirror value={types[type].toString()} options={{theme: 'monokai', mode: 'text/typescript-jsx'}}/>
    </>
  );
}
