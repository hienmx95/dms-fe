import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import DirectSalesOrderDetail from './DirectSalesOrderDetail';

describe('DirectSalesOrderDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <DirectSalesOrderDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
