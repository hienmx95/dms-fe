import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ERouteChangeRequestDetail from './ERouteChangeRequestDetail';

describe('ERouteChangeRequestDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ERouteChangeRequestDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
