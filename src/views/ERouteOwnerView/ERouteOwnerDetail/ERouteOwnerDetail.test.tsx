import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ERouteOwnerDetail from './ERouteOwnerDetail';

describe('ERouteDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ERouteOwnerDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
