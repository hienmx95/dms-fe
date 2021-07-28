import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import WarehouseMaster from './WarehouseMaster';

describe('WarehouseMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <WarehouseMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
