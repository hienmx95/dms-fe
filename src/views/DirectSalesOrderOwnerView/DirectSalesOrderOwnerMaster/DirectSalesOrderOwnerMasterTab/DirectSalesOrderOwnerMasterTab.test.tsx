import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import DirectSalesOrderOwnerMasterTab from './DirectSalesOrderOwnerMasterTab';

describe('IndirectSalesOrderMasterTab', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <DirectSalesOrderOwnerMasterTab />
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
