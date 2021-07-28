import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import SurveyMaster from './SurveyMaster';

describe('SurveyMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <SurveyMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
