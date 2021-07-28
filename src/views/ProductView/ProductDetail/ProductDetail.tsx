import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import { API_PRODUCT_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { PRODUCT_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { Product } from 'models/Product';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PriceAndVariations from 'views/ProductView/ProductDetail/PriceAndVariations/PriceAndVariations';
import { productRepository } from 'views/ProductView/ProductRepository';
import './ProductDetail.scss';
import ProductDetailGeneral from './ProductDetailGeneral/ProductDetailGeneral';

function ProductDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(PRODUCT_ROUTE);

  const { validAction } = crudService.useAction(
    'product',
    API_PRODUCT_ROUTE,
    'mdm',
  );

  const [
    product,
    setProduct,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Product,
    productRepository.get,
    productRepository.save,
  );

  return (
    <div className="page detail-page page-detail-product">
      <Spin spinning={loading}>
        <Card
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('appUsers.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                {!isDetail && validAction('create') && (
                  <button
                    className="btn btn-sm btn-primary float-right mr-2"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}

                {isDetail && validAction('update') && (
                  <button
                    className="btn btn-sm btn-primary float-right mr-2"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="title-detail">{translate('products.general')}</div>
          <ProductDetailGeneral product={product} setProduct={setProduct} />
        </Card>
        {product.usedVariationId === 1 && (
          <Card className="mt-3">
            <div className="title-price-variation title-detail">
              {translate('products.variationsAndPrice')}
            </div>
            <PriceAndVariations product={product} setProduct={setProduct} />

            <div className="d-flex justify-content-end mt-4">
              {!isDetail && validAction('create') && (
                <button
                  className="btn btn-sm btn-primary float-right mr-2"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}

              {isDetail && validAction('update') && (
                <button
                  className="btn btn-sm btn-primary float-right mr-2"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-primary mr-2"
                onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
}

export default ProductDetail;
