import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';
import ImageUpload from './ImageUpload';

describe('ImageUpload', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <ImageUpload defaultItems={[]}/>
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
