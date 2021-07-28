import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreTypeMaster from './StoreTypeMaster';

describe('StoreTypeMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreTypeMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});