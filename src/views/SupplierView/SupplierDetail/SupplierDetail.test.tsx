import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import SupplierDetail from './SupplierDetail';

describe('SupplierDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <SupplierDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
