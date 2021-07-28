import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import WarehouseDetail from './ShowingWarehouseDetail';

describe('WarehouseDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <WarehouseDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
