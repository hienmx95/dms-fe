import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreGroupingDetail from './StoreGroupingDetail';

describe('StoreGroupingDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreGroupingDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
