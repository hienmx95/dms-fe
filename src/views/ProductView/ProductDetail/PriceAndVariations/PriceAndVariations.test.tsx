import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';

import PriceAndVariations from './PriceAndVariations';
import {Product} from 'models/Product';
import {configTests} from 'setupTests';

describe('PriceAndVariations', () => {
  it('renders without crashing', () => {
    configTests()
      .then(() => {
        const div = document.createElement('div');
        const data = {
          product: new Product(),
          setProduct: () => {
            this.product = new Product();
          },
        };
        ReactDOM.render(
          <MemoryRouter>
            <PriceAndVariations product={data.product} setProduct={data.setProduct}/>
          </MemoryRouter>,
          div,
        );
        ReactDOM.unmountComponentAtNode(div);
      });
  });
});
