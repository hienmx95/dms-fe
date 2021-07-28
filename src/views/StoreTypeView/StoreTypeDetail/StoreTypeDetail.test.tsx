import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreTypeDetail from './StoreTypeDetail';

describe('StoreTypeDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreTypeDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});