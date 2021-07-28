import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import PromotionCodeMaster from './PromotionCodeMaster';

describe('PromotionCodeMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <PromotionCodeMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
