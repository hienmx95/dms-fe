import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ProductTypeMaster from './ProductTypeMaster';

describe('ProductTypeMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductTypeMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});