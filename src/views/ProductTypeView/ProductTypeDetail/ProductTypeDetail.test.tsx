import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ProductTypeDetail from './ProductTypeDetail';

describe('ProductTypeDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductTypeDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
