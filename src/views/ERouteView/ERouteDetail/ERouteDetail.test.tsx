import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ERouteDetail from './ERouteDetail';

describe('ERouteDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ERouteDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
