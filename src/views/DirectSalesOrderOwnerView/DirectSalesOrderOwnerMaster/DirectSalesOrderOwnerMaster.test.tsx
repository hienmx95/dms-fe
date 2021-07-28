import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import DirectSalesOrderMaster from './DirectSalesOrderMaster';

describe('DirectSalesOrderMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <DirectSalesOrderMaster />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
