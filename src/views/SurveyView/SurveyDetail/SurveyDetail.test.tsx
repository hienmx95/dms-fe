import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import SurveyDetail from './SurveyDetail';

describe('SurveyDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <SurveyDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
