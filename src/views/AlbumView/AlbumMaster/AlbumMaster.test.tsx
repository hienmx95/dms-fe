import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import AlbumMaster from './AlbumMaster';

describe('AlbumMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <AlbumMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
