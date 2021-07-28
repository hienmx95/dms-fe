import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import WorkflowDirectionMaster from './WorkflowDirectionMaster';

describe('WorkflowDirectionMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <WorkflowDirectionMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
