import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import WorkflowStepMaster from './WorkflowStepMaster';

describe('WorkflowStepMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <WorkflowStepMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
