import { Col, Row, Spin, Tabs } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { API_SURVEY_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { Survey } from 'models/Survey';
import { SurveyFilter } from 'models/SurveyFilter';
import { SurveyOption } from 'models/SurveyOption';
import { SurveyQuestion } from 'models/SurveyQuestion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { surveyRepository } from 'views/SurveyView/SurveyRepository';
import './SurveyMasterPreview.scss';
import SurveyOtherPreview from './SurveyOtherPreview';
import SurveyStorePreview from './SurveyStorePreview';
import SurveyStoreScoutingPreview from './SurveyStoreScoutingPreview';
import { v4 as uuidv4 } from 'uuid';
// for preview image
import { Lightbox } from 'react-modal-image';
export interface SurveyPreviewProps {
  survey: Survey;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
}

const { TabPane } = Tabs;

export default function SurveyPreview(props: SurveyPreviewProps) {
  const { survey, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('survey', API_SURVEY_ROUTE);
  const [statistic, setStatistic] = React.useState<any>(null);

  const [visibleStore, setVisibleStore] = React.useState<boolean>(false);
  const [visibleStoreScouting, setVisibleStoreScouting] = React.useState<
    boolean
  >(false);
  const [visibleOther, setVisibleOther] = React.useState<boolean>(false);
  const [surveyFilter, setSurveyFilter] = React.useState<SurveyFilter>(
    new SurveyFilter(),
  );
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (isOpen) {
      surveyFilter.id.equal = survey.id;
      setSurveyFilter({ ...surveyFilter });
      setIsOpen(false);
    }
  }, [surveyFilter, setSurveyFilter, survey, setIsOpen, isOpen]);

  const [handleExport] = crudService.useExport(
    surveyRepository.export,
    surveyFilter,
  );

  const [currentPreview, setCurrentPreview] = React.useState<string>(null);

  function handlePreview(url: string) {
    return () => {
      setCurrentPreview(url);
    };
  }

  const handleClosePreview = React.useCallback(() => {
    if (currentPreview) {
      setCurrentPreview(null);
    }
  }, [currentPreview]);

  const renderViewImage = React.useMemo(() => {
    return (question: SurveyQuestion) => (
      <div style={{ width: '60%' }}>
        {question?.surveyQuestionImageMappings &&
          question?.surveyQuestionImageMappings.length > 0 &&
          question?.surveyQuestionImageMappings.map(item => (
            <>
              <div
                key={item.imageId ? item.imageId : uuidv4()}
                style={{
                  marginBottom: '20px',
                  width: '100%',
                  height: '206px',
                }}
                className={`thumbnail survey-preview`}
              >
                <img
                  src={item?.image.url}
                  width="auto"
                  height="206px"
                  alt=""
                  style={{ objectFit: 'cover' }}
                  onClick={handlePreview(item?.image.url)}
                />
              </div>
              {currentPreview === item?.image.url ? (
                <Lightbox
                  large={item?.image.url}
                  alt={item?.image.name}
                  onClose={handleClosePreview}
                />
              ) : null}
            </>
          ))}
      </div>
    );
  }, [handleClosePreview, currentPreview]);

  const renderViewFiles = React.useMemo(() => {
    return (question: SurveyQuestion) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '40%',
          paddingLeft: '20px',
        }}
      >
        {question?.surveyQuestionFileMappings &&
          question?.surveyQuestionFileMappings.length > 0 &&
          question?.surveyQuestionFileMappings.map(
            (fileItem: any, fileIndex: number) => (
              <div key={fileIndex} className={'survey-question__file-item'}>
                <a
                  className={'survey-question__file-link'}
                  href={`${fileItem.file?.path}`}
                >{`${fileItem.file?.name}`}</a>
              </div>
            ),
          )}
      </div>
    );
  }, []);

  const renderOptionForQuestionType3 = React.useMemo(() => {
    return (question: SurveyQuestion) => {
      const rowOption = question.surveyOptions.filter(
        option => option.surveyOptionTypeId === 2,
      );
      const colOption = question.surveyOptions.filter(
        option => option.surveyOptionTypeId === 3,
      );

      return (
        <div className="list-item">
          <div className="list-item-view-container">
            <div className="list-item-form-scroll">
              <div className="table-item">
                <div className="mt-3 question-header">
                  <div className="question-header-row row-content td-header td-header-first"></div>
                  {colOption.length > 0 &&
                    colOption.map(option => (
                      <div className="question-header-row" key={option?.id}>
                        {option?.content}
                      </div>
                    ))}
                </div>

                {rowOption.length > 0 &&
                  rowOption.map(option => (
                    <div className="mt-3 row-group" key={option?.id}>
                      <div className="row-group-content">
                        <div className="row-content td-header item-cell">
                          {option?.content}
                        </div>
                        {colOption.length > 0 &&
                          colOption.map(option => (
                            <div
                              key={option.id}
                              className="ml-2 row-checked question-header-row"
                            >
                              {question.surveyQuestionTypeId === 3 && (
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="circle" key={option?.id} />
                                </div>
                              )}
                              {question.surveyQuestionTypeId === 4 && (
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="checkbox" key={option?.id} />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="list-item-form-scroll list-item-absolute">
              <div className="table-item">
                <div className="mt-3 question-header">
                  <div className="question-header-row row-content td-header"></div>
                  {colOption.length > 0 &&
                    colOption.map(option => (
                      <div
                        className="question-header-row item-cell"
                        key={option?.id}
                      >
                        {option?.content}
                      </div>
                    ))}
                </div>

                {rowOption.length > 0 &&
                  rowOption.map(option => (
                    <div className="mt-3 row-group" key={option?.id}>
                      <div className="row-group-content">
                        <div className="row-content td-header">
                          {option?.content}
                        </div>
                        {colOption.length > 0 &&
                          colOption.map(option => (
                            <div
                              key={option.id}
                              className="ml-2 row-checked question-header-row item-cell"
                            >
                              {question.surveyQuestionTypeId === 3 && (
                                <div className="d-flex justify-content-center align-items-center">
                                  <div
                                    className="circle mt-2"
                                    key={option?.id}
                                  />
                                </div>
                              )}
                              {question.surveyQuestionTypeId === 4 && (
                                <div
                                  className="checkbox mt-2"
                                  key={option?.id}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      );
    };
  }, []);

  const handleClickTab = React.useCallback(
    key => {
      if (key === 'answer') {
        surveyRepository.answerStatistics(survey.id).then(item => {
          setStatistic({ ...item });
        });
      }
    },
    [survey.id],
  );

  const handleGoStoreView = React.useCallback(() => {
    setVisibleStore(true);
  }, [setVisibleStore]);

  const handleCloseStoreView = React.useCallback(() => {
    setVisibleStore(false);
  }, [setVisibleStore]);

  const handleGoStoreScoutingView = React.useCallback(() => {
    setVisibleStoreScouting(true);
  }, [setVisibleStoreScouting]);

  const handleCloseStoreScoutingView = React.useCallback(() => {
    setVisibleStoreScouting(false);
  }, [setVisibleStoreScouting]);

  const handleGoOtherView = React.useCallback(() => {
    setVisibleOther(true);
  }, [setVisibleOther]);

  const handleCloseOtherView = React.useCallback(() => {
    setVisibleOther(false);
  }, [setVisibleOther]);

  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={translate('surveys.preview.title')}
      className="modal-preview survey-preview"
    >
      <Spin spinning={previewLoading}>
        <div className="container">
          <Row>
            <Col>
              <div className="title-survey mt-4 mb-4 ml-3">{survey?.title}</div>
              <div className="description ml-3 mb-4">{survey?.description}</div>
            </Col>
          </Row>

          <Tabs
            defaultActiveKey="1"
            className="ml-3 mr-3"
            onTabClick={handleClickTab}
          >
            <TabPane
              key="question"
              tab={translate('surveys.tabs.answer.title')}
            >
              {survey?.surveyQuestions &&
                survey?.surveyQuestions.length > 0 &&
                survey?.surveyQuestions.map(
                  (surveyQuestion: SurveyQuestion, index: number) => (
                    <div className="survey-question mt-5" key={index}>
                      <div style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        {translate('surveys.questions')} {index + 1} :{' '}
                        <span className="ml-2" style={{ fontWeight: 'bold' }}>
                          {' '}
                          {surveyQuestion?.content}
                        </span>
                      </div>
                      <div style={{ display: 'flex' }}>
                        {renderViewImage(surveyQuestion)}

                        {renderViewFiles(surveyQuestion)}
                      </div>
                      {(surveyQuestion?.surveyQuestionTypeId === 1 ||
                        surveyQuestion?.surveyQuestionTypeId === 2) &&
                        surveyQuestion?.surveyOptions &&
                        surveyQuestion?.surveyOptions.length > 0 &&
                        surveyQuestion?.surveyOptions.map(
                          (surveyOption: SurveyOption) => (
                            <div
                              className="answer d-flex align-items-center mt-4"
                              key={surveyOption?.id}
                            >
                              {surveyQuestion.surveyQuestionTypeId === 1 && (
                                <div className="circle" />
                              )}
                              {surveyQuestion.surveyQuestionTypeId === 2 && (
                                <div className="checkbox" />
                              )}
                              <span className="ml-3">
                                {surveyOption?.content}
                              </span>
                            </div>
                          ),
                        )}
                      {(surveyQuestion?.surveyQuestionTypeId === 3 ||
                        surveyQuestion?.surveyQuestionTypeId === 4) &&
                        renderOptionForQuestionType3(surveyQuestion)}
                    </div>
                  ),
                )}
            </TabPane>
            <TabPane
              key="answer"
              tab={translate('surveys.tabs.question.title')}
            >
              <div className="mt-4 mb-4">
                {translate('surveys.tabs.answer.total')}:{' '}
                {statistic?.totalCounter}
              </div>
              <div className="mt-4 mb-4 ml-4">
                {translate('surveys.tabs.answer.store')}:{' '}
                <span className="display-code" onClick={handleGoStoreView}>
                  {statistic?.storeCounter}
                </span>
              </div>
              <div className="mt-4 mb-4 ml-4">
                {translate('surveys.tabs.answer.storeScouting')}:{' '}
                <span
                  className="display-code"
                  onClick={handleGoStoreScoutingView}
                >
                  {statistic?.storeScoutingCounter}
                </span>
              </div>
              <div className="mt-4 mb-4 ml-4">
                {translate('surveys.tabs.answer.other')}:{' '}
                <span className="display-code" onClick={handleGoOtherView}>
                  {statistic?.otherCounter}
                </span>
              </div>
              {validAction('export') && (
                <button
                  className="btn btn-sm btn-outline-primary mr-2"
                  onClick={handleExport}
                >
                  <i className="tio-file_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.export)}
                </button>
              )}
            </TabPane>
          </Tabs>
          {visibleStore && (
            <SurveyStorePreview
              title={survey.title}
              model={statistic}
              setModel={setStatistic}
              visible={visibleStore}
              onClose={handleCloseStoreView}
              listStore={statistic.storeResults}
              count={statistic.storeCounter}
            />
          )}
          {visibleStoreScouting && (
            <SurveyStoreScoutingPreview
              title={survey.title}
              model={statistic}
              setModel={setStatistic}
              visible={visibleStoreScouting}
              onClose={handleCloseStoreScoutingView}
              listStore={statistic.storeScoutingResults}
              count={statistic.storeScoutingCounter}
            />
          )}

          {visibleOther && (
            <SurveyOtherPreview
              title={survey.title}
              model={statistic}
              setModel={setStatistic}
              visible={visibleOther}
              onClose={handleCloseOtherView}
              listStore={statistic.otherResults}
              count={statistic.otherCounter}
            />
          )}
        </div>
      </Spin>
    </MasterPreview>
  );
}
