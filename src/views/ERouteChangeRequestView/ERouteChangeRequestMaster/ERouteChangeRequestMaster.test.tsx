import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ERouteChangeRequestMaster from './ERouteChangeRequestMaster';

describe('ERouteChangeRequestMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ERouteChangeRequestMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
