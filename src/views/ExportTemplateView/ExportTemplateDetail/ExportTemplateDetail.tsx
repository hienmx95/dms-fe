import { Input } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_EXPORT_TEMPLATE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { EXPORT_TEMPLATE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { ExportTemplate } from 'models/ExportTemplate';
import { ExportTemplateFilter } from 'models/ExportTemplateFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { exportTemplateRepository } from 'views/ExportTemplateView/ExportTemplateRepository';
import { exportTemplateService } from '../ExportTemplateService';
import './ExportTemplateDetail.scss';
import ExportTemplateJSON from './ExportTemplateJSON';

const { Item: FormItem } = Form;

function ExportTemplateDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(EXPORT_TEMPLATE_ROUTE);
  const { validAction } = crudService.useAction(
    'export-template',
    API_EXPORT_TEMPLATE_ROUTE,
  );
  // Hooks, useDetail, useChangeHandler
  const [
    exportTemplate,
    ,
    loading,
    setLoading,
    isDetail,
  ] = crudService.useDetail(
    ExportTemplate,
    exportTemplateRepository.get,
    exportTemplateRepository.save,
  );

  const [exportTemplateFilter, setExportTemplateFilter] = React.useState<
    ExportTemplateFilter
  >(new ExportTemplateFilter());

  const [model, setModel] = React.useState<string>(null);

  const [loadingExport, setLoadingExport] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [loadingJSON, setLoadingJSON] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (loadingExport && exportTemplate?.id) {
      exportTemplateFilter.id.equal = exportTemplate?.id;
      setExportTemplateFilter({ ...exportTemplateFilter });
      setLoadingExport(false);
    }
  }, [exportTemplate, exportTemplateFilter, loadingExport]);

  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
    fileName,
  ] = exportTemplateService.useImport(
    exportTemplateRepository.update,
    setLoading,
    exportTemplateFilter,
  );

  const handleOpenModal = React.useCallback(() => {
    setVisible(true);
    exportTemplateRepository.getExample(exportTemplate.id).then(res => {
      setModel(JSON.stringify(res, null, 4));
      setLoadingJSON(true);
    });
  }, [exportTemplate.id]);
  return (
    <div className="page detail-page exportTemplate-detail">
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
                    ? translate('general.detail.title')
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
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ExportTemplate
                  >(exportTemplate.errors, nameof(exportTemplate.code))}
                  help={exportTemplate.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('exportTemplates.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={exportTemplate.code}
                    className="form-control form-control-sm"
                    placeholder={translate('exportTemplates.placeholder.code')}
                    disabled
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ExportTemplate
                  >(exportTemplate.errors, nameof(exportTemplate.name))}
                  help={exportTemplate.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('exportTemplates.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={exportTemplate.name}
                    className="form-control form-control-sm"
                    placeholder={translate('exportTemplates.placeholder.name')}
                    // pattern=".{0,255}"
                    maxLength={255}
                    disabled
                  />
                </FormItem>
                {validAction('update') && (
                  <FormItem>
                    <label
                      className="btn btn-sm btn-outline-primary label-input ml-3 mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="tio-file_add_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
                    {fileName ? fileName : exportTemplate?.fileName}
                  </FormItem>
                )}
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                {validAction('getExample') && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleOpenModal}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate('exportTemplates.getExample')}
                  </button>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
      <input
        ref={ref}
        type="file"
        className="hidden"
        id="master-import"
        onChange={handleImport}
        onClick={handleClick}
      />
      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
      {visible && (
        <ExportTemplateJSON
          visible={visible}
          setVisible={setVisible}
          model={model}
          exportTemplate={exportTemplate}
          loading={loadingJSON}
          setLoading={setLoadingJSON}
        />
      )}
    </div>
  );
}

export default ExportTemplateDetail;
