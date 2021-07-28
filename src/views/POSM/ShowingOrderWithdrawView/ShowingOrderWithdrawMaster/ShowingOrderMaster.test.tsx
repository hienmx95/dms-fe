import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import UnitOfMeasureGroupingMaster from './ShowingOrderWithdrawMaster';

describe('UnitOfMeasureGroupingMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <UnitOfMeasureGroupingMaster />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
