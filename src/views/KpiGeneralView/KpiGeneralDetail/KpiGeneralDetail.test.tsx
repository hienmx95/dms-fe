import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import KpiGeneralDetail from './KpiGeneralDetail';

describe('KpiGeneralDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <KpiGeneralDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
