import { Card, Col, Form, Row, Spin } from 'antd';
import Table from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { generalLanguageKeys } from 'config/consts';
import React from 'react';
import nameof from 'ts-nameof.macro';
import { luckyNumberRepository } from '../LuckyNumberRepository';
import { useLuckyNumberMaster } from './LuckyNumberHook';

const { Item: FormItem } = Form;

export default function LuckyNumberMaster() {
  const {
    translate,
    columns,
    list,
    filter,
    loading,
    handleFilter,
    isReset,
    setIsReset,
    handleDefaultSearch,
    handleTableChange,
    statusFilter,
    setStatusFilter,
    handleReset,
    pagination,
    rowSelection,
    hasSelected,
    total,
    handleBulkDelete,
    handleExport,
    handleExportStore,
    handleExportTemplate,
    loadingImport,
    errVisible,
    setErrVisible,
    errorModel,
    handleClick,
    handleChange,
    ref,
    organizationFilter,
    setOrganizationFilter,
    dateFilter,
    handleDateFilter,
  } = useLuckyNumberMaster();

  return (
    <div className="page master-page">
      <Card
        title={translate('luckyNumbers.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('luckyNumbers.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(list[0].code))}
                    className="w-100"
                    placeholder={translate('luckyNumbers.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('luckyNumbers.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(list[0].name))}
                    className="w-100"
                    placeholder={translate('luckyNumbers.placeholder.name')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('luckyNumbers.value')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.value.contain)}
                    filter={filter.value}
                    onChange={handleFilter(nameof(list[0].value))}
                    className="w-100"
                    placeholder={translate('luckyNumbers.placeholder.value')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('luckyNumbers.rewardStatus')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.rewardStatusId}
                    filterType={nameof(filter.rewardStatusId.equal)}
                    value={filter.rewardStatusId.equal}
                    onChange={handleFilter(nameof(filter.rewardStatusId))}
                    getList={luckyNumberRepository.filterListRewardStatus}
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    searchType={nameof(statusFilter.name.contain)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('luckyNumbers.organization')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={filter.organizationId}
                    filterType={nameof(filter.organizationId.equal)}
                    value={filter.organizationId.equal}
                    onChange={handleFilter(nameof(filter.organizationId))}
                    getList={luckyNumberRepository.filterListOrganization}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('luckyNumbers.usedAt')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.usedAt))}
                    placeholder={[
                      translate('eRoutes.placeholder.startDate'),
                      translate('eRoutes.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {/* {validAction('list') && ( */}
            <>
              <button
                className="btn btn-sm btn-primary mr-2"
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
            </>
            {/* )} */}
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(list[0].id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {/* bulk delete button */}
                  {/* {validAction('bulkDelete') && ( */}
                  <button
                    className="btn btn-sm btn-danger mr-2"
                    disabled={!hasSelected}
                    onClick={handleBulkDelete}
                  >
                    <i className="fa mr-2 fa-trash" />
                    {translate(generalLanguageKeys.actions.delete)}
                  </button>
                  {/* )} */}
                  {/* {validAction('import') && ( */}
                  <label
                    className="btn btn-sm btn-outline-primary mr-2 mb-0"
                    htmlFor="master-import"
                  >
                    {loadingImport ? (
                      <Spin spinning={loadingImport} size="small" />
                    ) : (
                        <i className="tio-file_add_outlined mr-2" />
                      )}
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                  {/* )} */}
                  {/* {validAction('export') && ( */}
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate('luckyNumbers.export')}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExportStore}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate('luckyNumbers.exportStore')}
                  </button>
                  {/* )} */}
                  {/* {validAction('exportTemplate') && ( */}
                  <button
                    className="btn btn-sm btn-export-template mr-2"
                    onClick={handleExportTemplate}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
                  </button>
                  {/* )} */}
                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
        <input
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleChange}
          onClick={handleClick}
        />
      </Card>
      {typeof errorModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errorModel}
        />
      )}
    </div>
  );
}
