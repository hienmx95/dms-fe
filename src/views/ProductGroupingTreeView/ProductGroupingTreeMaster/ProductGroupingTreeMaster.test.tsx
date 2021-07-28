import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ProductGroupingMaster from './ProductGroupingMaster';

describe('ProductGroupingMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductGroupingMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
