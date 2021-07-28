import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import UnitOfMeasureMaster from './UnitOfMeasureMaster';

describe('UnitOfMeasureMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <UnitOfMeasureMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});