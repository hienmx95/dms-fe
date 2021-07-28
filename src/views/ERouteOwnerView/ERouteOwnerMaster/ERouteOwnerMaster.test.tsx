import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ERouteOwnerMaster from './ERouteOwnerMaster';

describe('ERouteMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ERouteOwnerMaster />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
