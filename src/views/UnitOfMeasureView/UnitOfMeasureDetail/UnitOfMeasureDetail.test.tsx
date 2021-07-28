import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import UnitOfMeasureDetail from './UnitOfMeasureDetail';

describe('UnitOfMeasureDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <UnitOfMeasureDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});