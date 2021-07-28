import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import IndirectSalesOrderDetail from './IndirectSalesOrderDetail';

describe('IndirectSalesOrderDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <IndirectSalesOrderDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
