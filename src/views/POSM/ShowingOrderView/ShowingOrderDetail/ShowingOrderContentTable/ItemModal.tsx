import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';

import AdvancedIdFilter, {
  AdvancedIdFilterType,
} from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Category } from 'models/Category';
import { Item } from 'models/Item';
import { ShowingCategoryFilter } from 'models/posm/ShowingCategoryFilter';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'reactn';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { showingOrderRepository } from '../../ShowingOrderRepository';
import { showingOrderService } from '../../ShowingOrderService';

export interface ContentModalProps<T extends Model> extends ModalProps {
  filter?: ShowingItemFilter;
  setFilter?: Dispatch<SetStateAction<ShowingItemFilter>>;
  handleFilter?: (field: string) => (f: any) => void;
  loadList?: boolean;
  setloadList?: Dispatch<SetStateAction<boolean>>;
  selectedList?: T[];
  setSelectedList?: Dispatch<SetStateAction<T[]>>;
  loading?: boolean;
  pagination?: PaginationConfig;
  isSave?: boolean;
  onSave?: (selectedList: Item[]) => void;
  onClose?: () => void;
}

function ItemModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    onSave,
    onClose,
    filter,
    setFilter,
    loadList,
    setloadList,
    selectedList,
    setSelectedList,
  } = props;

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [showingCategoryFilter, setShowingCategoryFilter] = React.useState<
    ShowingCategoryFilter
  >(new ShowingCategoryFilter());
  // const [selectedList, setSelectedList] = React.useState<ShowingItem[]>([]);

  const {
    list,
    loading,
    total,
    handleChangeFilter,
    handleSearch,
    handleDefaultSearch,
    handleReset,
    isReset,
    setIsReset,
  } = showingOrderService.useModalMaster(
    filter,
    setFilter,
    loadList,
    setloadList,
    showingOrderRepository.listShowingItem,
    showingOrderRepository.countShowingItem,
    onSave,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const idFilterEnum = React.useMemo(
    () => [
      { id: 1, name: translate('general.placeholder.title') },
      { id: 2, name: translate('general.actions.filterSelected') },
      { id: 3, name: translate('general.actions.filterUnSelected') },
    ],
    [translate],
  ); // enum List

  const selectedIds = React.useMemo(
    () => (selectedList.length > 0 ? selectedList.map(item => item.id) : []),
    [selectedList],
  );

  const rowSelection: TableRowSelection<ShowingItem> = crudService.useContentModalList<
    ShowingItem
  >(selectedList, setSelectedList);

  const columns: ColumnProps<ShowingItem>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 70,
        render: renderMasterIndex<ShowingItem>(pagination),
      },
      {
        title: translate('showingOrderContents.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),

        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.uom'),
        key: nameof(list[0].unitOfMeasure),
        dataIndex: nameof(list[0].unitOfMeasure),
        render(unitOfMeasure: UnitOfMeasure) {
          return unitOfMeasure?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.category'),
        key: nameof(list[0].showingCategory),
        dataIndex: nameof(list[0].showingCategory),
        render(showingCategory: Category) {
          return showingCategory?.name;
        },
        ellipsis: true,
      },
    ];
  }, [list, pagination, translate]);

  const handleCloseModal = useCallback(() => {
    setSelectedList([]);
    setFilter(new ShowingItemFilter());
    if (typeof onClose === 'function') onClose();
  }, [onClose, setFilter, setSelectedList]); // reset selected list and close

  return (
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
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrderContents.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleChangeFilter(nameof(filter.code))}
                    placeholder={translate(
                      'showingOrderContents.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrderContents.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleChangeFilter(nameof(filter.name))}
                    placeholder={translate(
                      'showingOrderContents.placeholder.name',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {/* {validAction('filterListUnitOfMeasure') && ( */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingOrderContents.unitOfMeasure')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.unitOfMeasureId}
                    filterType={nameof(filter.unitOfMeasureId.equal)}
                    value={filter.unitOfMeasureId.equal}
                    onChange={handleChangeFilter(
                      nameof(filter.unitOfMeasureId),
                    )}
                    getList={showingOrderRepository.filterListUnitOfMeasure}
                    modelFilter={unitOfMeasureFilter}
                    setModelFilter={setUnitOfMeasureFilter}
                    searchField={nameof(unitOfMeasureFilter.name)}
                    searchType={nameof(unitOfMeasureFilter.name.contain)}
                    placeholder={translate(
                      'showingOrderContents.placeholder.unitOfMeasure',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              {/* )} */}

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrderContents.category')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={filter.showingCategoryId}
                    filterType={nameof(filter.showingCategoryId.equal)}
                    value={filter.showingCategoryId.equal}
                    onChange={handleChangeFilter(
                      nameof(filter.showingCategoryId),
                    )}
                    getList={showingOrderRepository.filterListShowingCategory}
                    modelFilter={showingCategoryFilter}
                    setModelFilter={setShowingCategoryFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrderContents.selection')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.id}
                    onChange={handleChangeFilter(nameof(filter.id))}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    type={AdvancedIdFilterType.SELECTION}
                    selectedIds={selectedIds}
                    list={idFilterEnum}
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
          key={list[0]?.id}
          tableLayout="fixed"
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
          className="ml-4 mr-4"
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={handleCloseModal}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
}

export default ItemModal;
