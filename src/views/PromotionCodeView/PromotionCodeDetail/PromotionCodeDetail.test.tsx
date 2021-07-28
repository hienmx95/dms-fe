import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import PromotionCodeDetail from './PromotionCodeDetail';

describe('PromotionCodeDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <PromotionCodeDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
