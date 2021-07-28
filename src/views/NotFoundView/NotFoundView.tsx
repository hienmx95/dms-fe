import { ROOT_ROUTE } from 'config/route-consts';
import React from 'react';
import './NotFoundView.scss';

function NotFoundView() {
  const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    window.location.href = ROOT_ROUTE;
  };

  return (
    <div className="error-page">
      <div className="container">
        <div className="row">
          <div className="error-page-action col-md-6">
            <div className="row align-items-center">
              <div>
                <div className="title col-md-12 mb-4">
                  <img src="assets/img/brand/Group-232.png" alt={'noImage'} />
                </div>
                <div className="description col-md-12 mb-5">
                  We can’t seem to find a page you are looking for
                </div>
                <div className="comeback col-md-12">
                  <button onClick={handleClick}>Back to home</button>
                </div>
              </div>
            </div>
          </div>
          <div className="error-page-thumbnail col-md-6">
            <img src="assets/img/brand/Illu404.png" alt={'noImage'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundView;
