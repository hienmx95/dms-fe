import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import UnitOfMeasureGroupingDetail from './UnitOfMeasureGroupingDetail';

describe('UnitOfMeasureGroupingDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <UnitOfMeasureGroupingDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});