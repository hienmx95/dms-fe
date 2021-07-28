import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import IndirectSalesOrderMasterTab from './IndirectSalesOrderMasterTab';

describe('IndirectSalesOrderMasterTab', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <IndirectSalesOrderMasterTab />
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
