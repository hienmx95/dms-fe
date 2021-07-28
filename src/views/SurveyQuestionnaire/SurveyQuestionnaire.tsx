import React from 'react';
import './SurveyQuestionnaire.scss';
import { useTranslation } from 'react-i18next';
import { Card, Radio, Checkbox, Spin, Row, Col, Form } from 'antd';
import { surveyRepository } from './SurveyQuestionnaireRepository';
import { Survey } from 'models/Survey';
import { crudService, formService } from 'core/services';
import { SurveyQuestion } from 'models/SurveyQuestion';
import { SurveyOption } from 'models/SurveyOption';
import nameof from 'ts-nameof.macro';

const { Item: FormItem } = Form;
function SurverQuestionnaire() {
  const [translate] = useTranslation();
  const [checkStoreId, setStoreId] = React.useState<boolean>(false);

  // link mau: survey-form/17?storeId=17

  const [
    survey,
    setSurvey,
    loading,
    ,
    ,
    handleSave,
  ] = crudService.useDetail(
    Survey,
    surveyRepository.getSurveyForm,
    surveyRepository.saveSurveyForm,
  );
  React.useEffect(() => {
    const url = document.URL;
    if (url.includes('?storeId')) {
      setStoreId(true);
      const temp = url.split('storeId=');
      if (temp !== undefined && survey && (survey.storeId === undefined || survey.storeId === 0)) {
        setSurvey({
          ...survey,
          storeId: Number(temp[1]),
        });
      }
    }
  }, [setSurvey, survey, checkStoreId]);

  const handleChangeOptionType1 = React.useCallback((indexQuestion, id) => {
    return () => {
      if (survey && survey.surveyQuestions && survey.surveyQuestions[indexQuestion]
        && survey?.surveyQuestions[indexQuestion]?.listResult && survey?.surveyQuestions[indexQuestion]?.listResult?.hasOwnProperty(id)
      ) {
        const errors = survey?.surveyQuestions[indexQuestion]?.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.isMandatory = null;
        }
        const listResultTemp = Object.keys(survey.surveyQuestions[indexQuestion].listResult);
        listResultTemp.forEach((result) => {
          survey.surveyQuestions[indexQuestion].listResult[`${result}`] = false;
        });
        survey.surveyQuestions[indexQuestion].listResult[`${id}`] = true;
      }
      setSurvey({ ...survey });
    };
  }, [survey, setSurvey]);

  const handleChangeOptionType2 = React.useCallback((indexQuestion, id) => {
    return () => {
      if (survey && survey.surveyQuestions && survey.surveyQuestions[indexQuestion]
        && survey?.surveyQuestions[indexQuestion]?.listResult && survey?.surveyQuestions[indexQuestion]?.listResult?.hasOwnProperty(id)
      ) {
        const errors = survey?.surveyQuestions[indexQuestion]?.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.isMandatory = null;
        }
        survey.surveyQuestions[indexQuestion].listResult[`${id}`] = !survey.surveyQuestions[indexQuestion].listResult[`${id}`];
      }
      setSurvey({ ...survey });
    };
  }, [survey, setSurvey]);

  const handleChangeOptionType3 = React.useCallback((indexQuestion, rowId, columnId) => {
    return () => {
      if (survey && survey.surveyQuestions && survey.surveyQuestions[indexQuestion]
        && survey?.surveyQuestions[indexQuestion]?.tableResult && survey?.surveyQuestions[indexQuestion]?.tableResult?.hasOwnProperty(rowId)
      ) {
        const columnIdResultTmp = Object.keys(survey.surveyQuestions[indexQuestion].tableResult[`${rowId}`]);
        columnIdResultTmp.forEach((result) => {
          survey.surveyQuestions[indexQuestion].tableResult[`${rowId}`][`${result}`] = false;
        });
        survey.surveyQuestions[indexQuestion].tableResult[`${rowId}`][`${columnId}`] = true;
        const errors = survey?.surveyQuestions[indexQuestion]?.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.isMandatory = null;
        }
      }
      setSurvey({ ...survey });
    };
  }, [survey, setSurvey]);

  const handleChangeOptionType4 = React.useCallback((indexQuestion, rowId, columnId) => {
    return () => {
      if (survey && survey.surveyQuestions && survey.surveyQuestions[indexQuestion]
        && survey?.surveyQuestions[indexQuestion]?.tableResult && survey?.surveyQuestions[indexQuestion]?.tableResult?.hasOwnProperty(rowId)
      ) {
        const errors = survey?.surveyQuestions[indexQuestion]?.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.isMandatory = null;
        }
        survey.surveyQuestions[indexQuestion].tableResult[`${rowId}`][`${columnId}`] = !survey.surveyQuestions[indexQuestion].tableResult[`${rowId}`][`${columnId}`];
      }
      setSurvey({ ...survey });
    };
  }, [survey, setSurvey]);

  const handleChangeOptionType5 = React.useCallback((indexQuestion) => {
    return (event) => {
      if (survey && survey.surveyQuestions && survey.surveyQuestions[indexQuestion]) {
        survey.surveyQuestions[indexQuestion].textResult = event?.target?.value;
        const errors = survey?.surveyQuestions[indexQuestion]?.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.isMandatory = null;
        }
      }
      setSurvey({ ...survey });
    };
  }, [survey, setSurvey]);
  const renderOptionForQuestionType3 = React.useMemo(() => {
    return (question: SurveyQuestion, indexQuestion) => {
      const rowOptions = question.surveyOptions.filter(
        option => option.surveyOptionTypeId === 2,
      );
      const colOptions = question.surveyOptions.filter(
        option => option.surveyOptionTypeId === 3,
      );

      return (
        <div className="list-item">
          <div className="list-item-view-container">
            <div className="list-item-form-scroll">
              <div className="table-item">
                <div className="mt-3 question-header">
                  <div className="question-header-row row-content td-header td-header-first"></div>
                  {colOptions.length > 0 &&
                    colOptions.map(option => <div className="question-header-row" key={option?.id}>{option?.content}</div>)}
                </div>
                {question.surveyQuestionTypeId === 3 && (
                  <>
                    {
                      rowOptions.length > 0 &&
                      rowOptions.map(rowOption => (
                        <Radio.Group className="mt-3 row-group" key={rowOption?.id}>
                          <span className="row-group-content">
                            <div className="row-content td-header item-cell" >{rowOption?.content}</div>
                            {colOptions.length > 0 &&
                              colOptions.map((colOption) => (
                                <div key={colOption.id} className="ml-2 row-checked question-row">
                                  <div className="d-flex justify-content-center align-items-center">
                                    <Radio key={colOption?.id} value={colOption?.id} onChange={handleChangeOptionType3(indexQuestion, rowOption?.id, colOption?.id)} />
                                  </div>
                                </div>
                              ))}
                          </span>

                        </Radio.Group>
                      ))
                    }
                  </>

                )}
                {question.surveyQuestionTypeId === 4 && (
                  <>
                    {
                      rowOptions.length > 0 &&
                      rowOptions.map(rowOption => (
                        <div className="mt-3 row-group" key={rowOption?.id}>
                          <span className="row-group-content">
                            <div className="row-content td-header item-cell" >{rowOption?.content}</div>
                            {colOptions.length > 0 &&
                              colOptions.map((colOption) => (
                                <div key={colOption.id} className="ml-2 row-checked question-row">
                                  <div className="d-flex justify-content-center align-items-center ">
                                    <Checkbox key={colOption?.id} onChange={handleChangeOptionType4(indexQuestion, rowOption?.id, colOption?.id)} />
                                  </div>
                                </div>
                              ))}
                          </span>

                        </div>
                      ))
                    }
                  </>

                )}
              </div>

            </div>
            <div className="list-item-form-scroll list-item-absolute">
              <div className="table-item">
                <div className="mt-3 question-header">
                  <div className="question-header-row row-content td-header"></div>
                  {colOptions.length > 0 &&
                    colOptions.map(option => <div className="question-header-row item-cell" key={option?.id}>{option?.content}</div>)}
                </div>

                {question.surveyQuestionTypeId === 3 && (
                  <>
                    {
                      rowOptions.length > 0 &&
                      rowOptions.map(rowOption => (
                        <Radio.Group className="mt-3 row-group" key={rowOption?.id}>
                          <span className="row-group-content">
                            <div className="row-content td-header" >{rowOption?.content}</div>
                            {colOptions.length > 0 &&
                              colOptions.map((colOption) => (
                                <div key={colOption.id} className="ml-2 row-checked question-row">
                                  <div className="d-flex justify-content-center align-items-center item-cell">
                                    <Radio key={colOption?.id} value={colOption?.id} onChange={handleChangeOptionType3(indexQuestion, rowOption?.id, colOption?.id)} />
                                  </div>
                                </div>
                              ))}
                          </span>

                        </Radio.Group>
                      ))
                    }
                  </>

                )}
                {question.surveyQuestionTypeId === 4 && (
                  <>
                    {
                      rowOptions.length > 0 &&
                      rowOptions.map(rowOption => (
                        <div className="mt-3 row-group" key={rowOption?.id}>
                          <span className="row-group-content">
                            <div className="row-content td-header" >{rowOption?.content}</div>
                            {colOptions.length > 0 &&
                              colOptions.map((colOption) => (
                                <div key={colOption.id} className="ml-2 row-checked question-row">
                                  <div className="d-flex justify-content-center align-items-center item-cell">
                                    <Checkbox key={colOption?.id} onChange={handleChangeOptionType4(indexQuestion, rowOption?.id, colOption?.id)} />
                                  </div>
                                </div>
                              ))}
                          </span>

                        </div>
                      ))
                    }
                  </>

                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
  }, [handleChangeOptionType3, handleChangeOptionType4]);

  return (
    <div className="page master-page survey-answer">
      <Spin spinning={loading}>
        <Card title={<div className="ml-3">{translate('surveysAnswer.form.title')}</div>}>
          <div className="container">
            <Row>
              <Col>
                <div className="title-survey mt-2 mb-3">{survey?.title}</div>
                <div className="description">{survey?.description}</div>
              </Col>
              <Col>
                <div className="title-answer mt-3">{translate('surveysAnswer.answer.title')}</div>
              </Col>
            </Row>
            {survey?.surveyQuestions &&
              survey?.surveyQuestions.length > 0 &&
              survey?.surveyQuestions.map(
                (surveyQuestion: SurveyQuestion, indexQuestion: number) => (
                  <div key={indexQuestion}>
                    <div className="survey-question mt-3" key={indexQuestion}>
                      <div>
                        {translate('surveysAnswer.questions')} {indexQuestion + 1} :{' '}
                        <span className="ml-2">{surveyQuestion?.content}</span>

                      </div>
                      {surveyQuestion?.surveyQuestionTypeId === 1 &&
                        surveyQuestion?.surveyOptions &&
                        surveyQuestion?.surveyOptions.length > 0 && (
                          <Radio.Group>
                            {
                              surveyQuestion?.surveyOptions.map(
                                (surveyOption: SurveyOption) => (
                                  <div className="answer d-flex align-items-center mt-3" key={surveyOption?.id}>
                                    {surveyQuestion.surveyQuestionTypeId === 1 && (
                                      <Radio value={surveyOption?.id} onChange={handleChangeOptionType1(indexQuestion, surveyOption?.id)} />

                                    )}
                                    <span className="ml-2">
                                      {surveyOption?.content}
                                    </span>
                                  </div>
                                ),
                              )}
                          </Radio.Group>
                        )}

                      {surveyQuestion?.surveyQuestionTypeId === 2 &&
                        surveyQuestion?.surveyOptions &&
                        surveyQuestion?.surveyOptions.length > 0 &&
                        surveyQuestion?.surveyOptions.map(
                          (surveyOption: SurveyOption) => (
                            <div className="answer d-flex align-items-center mt-3" key={surveyOption?.id}>

                              {surveyQuestion.surveyQuestionTypeId === 2 && (
                                <Checkbox onChange={handleChangeOptionType2(indexQuestion, surveyOption?.id)} />
                              )}
                              <span className="ml-2">
                                {surveyOption?.content}
                              </span>
                            </div>
                          ),
                        )}
                      {(surveyQuestion?.surveyQuestionTypeId === 3 ||
                        surveyQuestion?.surveyQuestionTypeId === 4) &&
                        renderOptionForQuestionType3(surveyQuestion, indexQuestion)}
                      {(surveyQuestion?.surveyQuestionTypeId === 5) && (
                        <FormItem
                          validateStatus={formService.getValidationStatus<
                            SurveyQuestion
                          >(
                            surveyQuestion.errors,
                            nameof(surveyQuestion.textResult),
                          )}
                          help={surveyQuestion.errors?.textResult}
                          className="mt-3"
                        >
                          <textarea
                            rows={2}
                            defaultValue={surveyQuestion.textResult}
                            onChange={handleChangeOptionType5(indexQuestion)}
                            placeholder={translate('surveysAnswer.placeholder.textResult')}
                            className="form-control form-control-sm"
                          />
                        </FormItem>
                      )}
                    </div>
                    <FormItem
                      className="table-errors"
                      validateStatus={formService.getValidationStatus<SurveyQuestion>(
                        surveyQuestion.errors,
                        nameof(surveyQuestion.isMandatory),
                      )}
                      help={surveyQuestion.errors?.isMandatory}
                    />

                  </div>
                ),
              )}
            <button
              className="btn btn-sm btn-primary mt-4 mb-4"
              onClick={handleSave}
            >
              <i className="fa mr-2 fa-save" />
              {translate('surveysAnswer.actions.send')}
            </button>
          </div>

        </Card>
      </Spin>

    </div>
  );
}

export default SurverQuestionnaire;
