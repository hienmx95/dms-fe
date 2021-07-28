import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import WorkflowStepDetail from './WorkflowStepDetail';

describe('WorkflowStepDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <WorkflowStepDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
