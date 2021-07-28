import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import WorkflowDirectionDetail from './WorkflowDirectionDetail';

describe('WorkflowDirectionDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <WorkflowDirectionDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
