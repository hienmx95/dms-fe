import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import StoreScoutingMaster from './StoreScoutingMaster';

describe('StoreScoutingMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <StoreScoutingMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
