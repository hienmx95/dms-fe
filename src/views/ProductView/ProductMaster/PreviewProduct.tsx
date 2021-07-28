import { Descriptions, Spin, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { formatNumber } from 'core/helpers/number';
import { limitWord } from 'core/helpers/string';
import { Item } from 'models/Item';
import { Product } from 'models/Product';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';

export interface PreviewProductProps {
    product : Product;
    previewVisible: boolean;
    onClose: () => void;
    previewLoading: boolean;
    loading : boolean;
}

export default function PreviewProduct(props : PreviewProductProps) {
    const {product, previewVisible, onClose, previewLoading, loading} = props;
    const [translate] = useTranslation();
    const columnsPopup: ColumnProps<Item>[] = [
        {
          title: translate('items.name'),
          key: nameof(product.items[0].name),
          dataIndex: nameof(product.items[0].name),
          ellipsis: true,
        },
        {
          title: translate('items.code'),
          key: nameof(product.items[0].code),
          dataIndex: nameof(product.items[0].code),
        //   align: 'center',
        },
        {
          title: translate('items.scanCode'),
          key: nameof(product.items[0].scanCode),
          dataIndex: nameof(product.items[0].scanCode),
        },
        {
          title: translate('items.price'),
          key: nameof(product.items[0].salePrice),
          dataIndex: nameof(product.items[0].salePrice),
          render(salePrice : number){
              return <>{formatNumber(salePrice)}</>;
          },
        },
        {
          title: translate('items.retailPrice'),
          key: nameof(product.items[0].retailPrice),
          dataIndex: nameof(product.items[0].retailPrice),
          render(retailPrice : number){
            return <>{formatNumber(retailPrice)}</>;
        },
        },
      ];
      const renderItems = React.useMemo(() => {
        const contentList  = [];
        if (product) {
          if (product.productProductGroupingMappings) {
            if (
              product.productProductGroupingMappings.length > 0
            )
              product.productProductGroupingMappings.forEach(
                (content: ProductProductGroupingMapping) => {
                  if (content.productGrouping) {
                    const { productGrouping} = content;
                    const value = `${productGrouping.name}`;
                    contentList.push(value);
                  }
                },
              );
          }
        }
        return contentList.join(',');
      }, [product]);
    return (
        <MasterPreview
          isOpen={previewVisible}
          onClose={onClose}
          size="xl"
          title={product.name}
          code={product.code}
          statusId={product.statusId}
        >
          <Spin spinning={previewLoading}>
            <Descriptions column={4}>
              <Descriptions.Item label={translate('products.productType')}>
                {product?.productType && product?.productType.name}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.productGrouping')}>
                  <Tooltip title={renderItems} placement ="bottom">
                      {limitWord(renderItems , 20)}
                  </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.otherName')}>
                {product?.otherName}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.unitOfMeasure')}>
                {product?.unitOfMeasure &&
                  product?.unitOfMeasure.name}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.scanCode')}>
                {product?.scanCode}
              </Descriptions.Item>
              <Descriptions.Item
                label={translate('products.unitOfMeasureGrouping')}
              >
                {product?.unitOfMeasureGrouping && (
                  <Tooltip title={product?.unitOfMeasureGrouping.name} placement ="bottom">
                      {limitWord(product?.unitOfMeasureGrouping.name , 10)}
                  </Tooltip>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.technicalName')}>
                {product?.technicalName}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.supplier')}>
                {product?.supplier && product?.supplier.name}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.brand')}>
                {product?.brand && product?.brand.name}
              </Descriptions.Item>
              <Descriptions.Item label={translate('products.eRPCode')}>
                {product?.erpCode}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={translate('products.variationAndPrice')}
              column={1}
            >
              <Descriptions.Item>
                <Table
                    dataSource={product.items}
                    columns={columnsPopup}
                    size="small"
                    tableLayout="fixed"
                    loading={loading}
                    rowKey={nameof(product.id)}
                    // scroll={{ y: 240 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </MasterPreview>
    );
}
