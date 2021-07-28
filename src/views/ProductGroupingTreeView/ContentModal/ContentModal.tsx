import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService, tableService } from 'core/services';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import nameof from 'ts-nameof.macro';
import './ContentModal.scss';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { Form, Row, Col } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import { ProductFilter } from 'models/ProductFilter';
import { Product } from 'models/Product';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductType } from 'models/ProductType';
import { Supplier } from 'models/Supplier';
import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[], currentItem) => void;

  currentItem?: any;

  total?: number;

  getList?: (productFilter?: ProductFilter) => Promise<Product[]>;

  count?: (productFilter?: ProductFilter) => Promise<number>;

  onClose?: () => void;
}

function ContentModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    loading,
    list,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    total,
    getList,
    count,
    onClose,
  } = props;

  const rowSelection: TableRowSelection<Product> = crudService.useContentModalList<
    T
  >(selectedList, setSelectedList);

  const [filterProduct, setFilterProduct] = React.useState<ProductFilter>(
    new ProductFilter(),
  );
  const [listProduct, setListProduct] = React.useState<Product[]>([]);

  const [totalProduct, setTotal] = React.useState<number>(0);

  const [loadingProduct, setLoading] = React.useState<boolean>(loading);

  const [isReset, setIsReset] = React.useState<boolean>(false);

  React.useEffect(() => {
    setListProduct(list);
    setTotal(totalProduct);
    setLoading(false);
  }, [setListProduct, setTotal, setLoading, list, totalProduct]);

  const [pagination] = tableService.useMasterTable(
    filterProduct,
    setFilterProduct,
    total,
  );

  const columns: ColumnProps<Product>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 180,
        render: renderMasterIndex<Product>(pagination),
      },
      {
        title: translate('products.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
      },
      {
        title: translate('products.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
      },
      {
        title: translate('products.productGrouping'),
        key: nameof(list[0].productGrouping),
        dataIndex: nameof(list[0].productGrouping),
        render(productGrouping: ProductGrouping) {
          return productGrouping?.name;
        },
      },
      {
        title: translate('products.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].productType),
        render(productType: ProductType) {
          return productType?.name;
        },
      },
      {
        title: translate('products.supplier'),
        key: nameof(list[0].supplier),
        dataIndex: nameof(list[0].supplier),
        render(supplier: Supplier) {
          return supplier?.name;
        },
      },
    ];
  }, [list, pagination, translate]);

  const handleChangeFilter = React.useCallback(() => {
    Promise.all([getList(filterProduct), count(filterProduct)])
      .then(([listProduct, totalProduct]) => {
        setListProduct(listProduct);
        setTotal(totalProduct);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getList, filterProduct, count]);

  const handleReset = React.useCallback(() => {
    const newFilter = new ProductFilter();
    setFilterProduct(newFilter);
    setListProduct(list);
    setIsReset(true);
  }, [list]);

  const handleEnterName = React.useCallback((event: any, filterField) => {
    setFilterProduct({ ...filterProduct, search: event[filterField], skip: 0 });
    // setloadList(true);
  }, [filterProduct]);


  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {/* <Card
          className="head-borderless mb-4"
          title={translate(generalLanguageKeys.actions.search)}
        >
          {children}

        </Card> */}
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('products.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterProduct.code.contain)}
                    filter={filterProduct.code}
                    onChange={handleChangeFilter}
                    placeholder={translate('products.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('products.name')}
                  labelAlign="left"
                >
                  <AdvancedStringNoTypeFilter
                    filter={filterProduct}
                    filterField={nameof(filterProduct.search)}
                    onChange={handleEnterName}
                    placeholder={translate('items.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                  {/* <AdvancedStringFilter
                    filterType={nameof(filterProduct.name.contain)}
                    filter={filterProduct.name}
                    onChange={handleChangeFilter}
                    placeholder={translate('products.placeholder.name')}
                    className="w-100"
                  /> */}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-end mt-3 mb-3">
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
          key={listProduct[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={listProduct}
          loading={loadingProduct}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listProduct[0].id)}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList, currentItem)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={onClose}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ContentModal;
