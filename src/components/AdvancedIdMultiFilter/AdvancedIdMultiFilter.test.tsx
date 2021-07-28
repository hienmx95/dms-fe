import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import nameof from 'ts-nameof.macro';
import AdvancedIdMultiFilter from './AdvancedIdMultiFilter';
import { IdFilter } from 'core/filters';
import { configTests } from 'setupTests';

describe('AdvancedIdMultiFilter', () => {
  it('renders without crashing', () => {
    configTests()
      .then(() => {
        const div = document.createElement('div');
        const filter: IdFilter = new IdFilter();
        ReactDOM.render(
          <MemoryRouter>
            <AdvancedIdMultiFilter filter={filter} filterType={nameof(filter.equal)} />
          </MemoryRouter>,
          div,
        );
        ReactDOM.unmountComponentAtNode(div);
      });
  });
});
