import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import Inventories from './Inventories';

describe('Inventories', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <Inventories/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
