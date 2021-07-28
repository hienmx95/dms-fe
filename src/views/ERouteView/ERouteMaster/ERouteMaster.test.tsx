import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ERouteMaster from './ERouteMaster';

describe('ERouteMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ERouteMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
