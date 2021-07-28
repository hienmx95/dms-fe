import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import AlbumDetail from './AlbumDetail';

describe('AlbumDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <AlbumDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
