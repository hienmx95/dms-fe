import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import SupplierMaster from './SupplierMaster';

describe('SupplierMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <SupplierMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
