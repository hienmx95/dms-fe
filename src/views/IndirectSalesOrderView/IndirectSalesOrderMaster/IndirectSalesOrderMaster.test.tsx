import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import IndirectSalesOrderMaster from './IndirectSalesOrderMaster';

describe('IndirectSalesOrderMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <IndirectSalesOrderMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
