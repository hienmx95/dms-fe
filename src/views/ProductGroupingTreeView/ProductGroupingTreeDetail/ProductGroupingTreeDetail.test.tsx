import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ProductGroupingTreeDetail from './ProductGroupingTreeDetail';

describe('ProductGroupingDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductGroupingTreeDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
