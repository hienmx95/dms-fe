import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BrandDetail from './BrandDetail';


describe('BrandDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <BrandDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
