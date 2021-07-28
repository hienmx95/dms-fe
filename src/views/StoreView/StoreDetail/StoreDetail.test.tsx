import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreDetail from './StoreDetail';

describe('StoreDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
