import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import KpiGeneralMaster from './KpiGeneralMaster';

describe('KpiGeneralMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <KpiGeneralMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
