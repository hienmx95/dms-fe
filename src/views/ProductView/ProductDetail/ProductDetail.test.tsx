import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ProductDetail from './ProductDetail';

describe('ProductDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});