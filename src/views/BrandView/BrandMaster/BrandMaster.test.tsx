import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import BrandMaster from './BrandMaster';

describe('BrandMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <BrandMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
