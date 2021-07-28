import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreGroupingMaster from './StoreGroupingMaster';

describe('StoreGroupingMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreGroupingMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
