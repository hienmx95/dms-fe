import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreMaster from './StoreMaster';

describe('StoreMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
