import { Col, Form, Row } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Product } from 'models/Product';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap/lib';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import nameof from 'ts-nameof.macro';

import { v4 as uuidv4 } from 'uuid';
import { priceListOwnerRepository } from 'views/PriceListOwner/PriceListOwnerRepository';
import { PriceListMappingModalState, priceListOwnerService } from 'views/PriceListOwner/PriceListOwnerService';

const { Item: FormItem } = Form;

export interface PriceListItemMappingModalProps extends ModalProps {
  loadList?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
  onSave?: (list: Item[]) => void;
  onClose?: () => void;
  selectedList?: Item[];
  setSelectedList?: Dispatch<SetStateAction<Item[]>>;
}

type PriceListItemMappingModalState = PriceListMappingModalState<
  Item,
  ItemFilter
>;

export default function PriceListItemMappingModal(
  props: PriceListItemMappingModalProps,
) {
  const {
    isOpen,
    toggle,
    loadList,
    setLoadList,
    onSave,
    onClose,
    selectedList,
    setSelectedList,
  } = props;

  const defaultState = useMemo(
    () => ({
      list: [],
      filter: new ItemFilter(),
      loading: false,
    }),
    [],
  );

  const {
    translate,
    handleSave,
    handleClose,
    loading,
    list,
    filter,
    isReset,
    setIsReset,
    handleFilter,
    handleDefaultSearch,
    handleReset,
    rowSelection,
    pagination,
    handleTableChange,
  } = priceListOwnerService.usePriceListMappingModal<Item, ItemFilter>(
    ItemFilter,
    loadList,
    setLoadList,
    onSave,
    onClose,
    priceListOwnerRepository.listItem,
    priceListOwnerRepository.countItem,
    defaultState,
    selectedList,
    setSelectedList,
  );

  const {
    productGroupingFilter,
    setProductGroupingFilter,
    productTypeFilter,
    setProductTypeFilter,
  } = useModalFilter();

  const columns: ColumnProps<Item>[] = useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Item>(pagination),
      },
      {
        title: translate('priceLists.item.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        width: 120,
        render(code: string) {
          return code;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.item.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        width: 200,
        render(name: string) {
          return name;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.item.otherName'),
        key: nameof(list[0].otherName),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return <>{product?.otherName}</>;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.item.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return <>{product?.productType.name}</>;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.item.productGrouping'),
        key: nameof(list[0].productGrouping),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          if (product.productProductGroupingMappings?.length > 0) {
            return (
              <>
                {product.productProductGroupingMappings
                  .map(item => item.productGrouping)
                  .map(item => (
                    <div
                      key={item.id ? item.id : uuidv4()}
                      className="p-1 mb-1"
                      style={{
                        background: '#f0f0f0',
                        borderRadius: 5,
                        border: '1px solid #eeeeee',
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
              </>
            );
          }
          return <></>;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.item.scanCode'),
        key: nameof(list[0].scanCode),
        dataIndex: nameof(list[0].scanCode),
        render(scanCode: string) {
          return scanCode;
        },
        ellipsis: true,
      },
    ],
    [list, pagination, translate],
  );


  const handleEnterName = React.useCallback((event: any, filterField) => {
    filter.search = event[filterField];
    filter.skip = 0;
    // setFilter({ ...filter, search: event[filterField], skip: 0 });
    setLoadList(true);
  }, [filter, setLoadList]);

  return (
    <>
      <ModalContent
        size="xl"
        isOpen={isOpen}
        backdrop="static"
        toggle={toggle}
        unmountOnClose={true}
      >
        <ModalBody>
          <CollapsibleCard
            className="head-borderless mb-3"
            title={translate('priceLists.priceListItemMappingModal')}
          >
            <Form>
              <Row className="ml-2 mr-3">
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.item.code')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.code.contain)}
                      filter={filter.code}
                      onChange={handleFilter(nameof(filter.code))}
                      placeholder={translate('priceLists.placeholder.code')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.item.productGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleFilter(nameof(filter.productGroupingId))}
                      getList={priceListOwnerRepository.singleListProductGrouping}
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.item.name')}
                    labelAlign="left"
                  >
                    {/* <AdvancedStringFilter
                      filterType={nameof(filter.name.contain)}
                      filter={filter.name}
                      onChange={handleFilter(nameof(filter.name))}
                      placeholder={translate('priceLists.item.name')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    /> */}

                    <AdvancedStringNoTypeFilter
                      filter={filter}
                      filterField={nameof(filter.search)}
                      onChange={handleEnterName}
                      placeholder={translate('items.placeholder.name')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.item.productType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.productTypeId}
                      filterType={nameof(filter.productTypeId.equal)}
                      value={filter.productTypeId.equal}
                      onChange={handleFilter(nameof(filter.productTypeId))}
                      getList={priceListOwnerRepository.singleListProductType}
                      modelFilter={productTypeFilter}
                      setModelFilter={setProductTypeFilter}
                      searchField={nameof(productTypeFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('priceLists.item.productType')}
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.item.scanCode')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.scanCode.contain)}
                      filter={filter.scanCode}
                      onChange={handleFilter(nameof(filter.scanCode))}
                      placeholder={translate('priceLists.item.itemScanCode')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.item.otherName')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.otherName.contain)}
                      filter={filter.otherName}
                      onChange={handleFilter(nameof(filter.otherName))}
                      placeholder={translate('priceLists.item.otherName')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div className="d-flex justify-content-start mt-3 mb-3 ml-2">
              <button
                className="btn btn-sm btn-primary mr-2 ml-1"
                onClick={handleDefaultSearch}
              >
                <i className="tio-filter_outlined mr-2" />
                {translate(generalLanguageKeys.actions.filter)}
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleReset}
              >
                <i className="tio-clear_circle_outlined mr-2" />
                {translate(generalLanguageKeys.actions.reset)}
              </button>
            </div>
          </CollapsibleCard>
          <Table
            bordered={false}
            dataSource={list}
            columns={columns}
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(list[0].id)}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={handleTableChange}
          />
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end mt-4 mr-3">
            {/* saveModal */}
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            {/* closeModal */}
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleClose}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </>
  );
}

function useModalFilter() {
  const [productGroupingFilter, setProductGroupingFilter] = useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  const [productTypeFilter, setProductTypeFilter] = useState<ProductTypeFilter>(
    new ProductTypeFilter(),
  );
  return {
    productGroupingFilter,
    setProductGroupingFilter,
    productTypeFilter,
    setProductTypeFilter,
  };
}
