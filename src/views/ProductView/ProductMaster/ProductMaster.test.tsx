import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ProductMaster from './ProductMaster';

describe('ProductMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});