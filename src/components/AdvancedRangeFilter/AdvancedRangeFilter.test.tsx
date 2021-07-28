import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import nameof from 'ts-nameof.macro';
import AdvancedRangeFilter from './AdvancedRangeFilter';
import { DateFilter } from 'core/filters';
import { configTests } from 'setupTests';

describe('AdvancedRangeFilter', () => {
  it('renders without crashing', () => {
    configTests()
      .then(() => {
        const div = document.createElement('div');
        const filter: DateFilter = new DateFilter();
        ReactDOM.render(
          <MemoryRouter>
            <AdvancedRangeFilter filter={filter}
              filterType={nameof(filter.equal)} />
          </MemoryRouter>,
          div,
        );
        ReactDOM.unmountComponentAtNode(div);
      });
  });
});
