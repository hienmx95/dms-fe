import { Input, Modal, Switch, Tooltip } from 'antd';
import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import { API_SURVEY_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { formatInputDate } from 'core/helpers/date-time';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Status } from 'models/Status';
import { Survey } from 'models/Survey';
import { SurveyFilter } from 'models/SurveyFilter';
import { SurveyOption } from 'models/SurveyOption';
import { SurveyQuestion } from 'models/SurveyQuestion';
import { SurveyQuestionType } from 'models/SurveyQuestionType';
import { SurveyQuestionTypeFilter } from 'models/SurveyQuestionTypeFilter';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { surveyRepository } from 'views/SurveyView/SurveyRepository';
import './SurveyDetail.scss';

// special import for new task
import ImageUpload from 'components/ImageUpload/ImageUpload';
import { Image } from 'models/Image';
import { FileModel } from 'models/ChatBox/FileModel';

const { Item: FormItem } = Form;

export interface SurveyDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getList?: (filter: TFilter) => Promise<T[]>;
  setList?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function SurveyDetail<T extends Model, TFilter extends ModelFilter>(
  props: SurveyDetailProps<T, TFilter>,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('survey', API_SURVEY_ROUTE);

  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getList,
    setList,
    setLoadList,
  } = props;

  const [displayAddButton, setDisplayAddButton] = useState<boolean>(false);
  const [survey, setSurvey, , , handleSave] = crudService.usePopupDetail(
    Survey,
    SurveyFilter,
    isDetail,
    currentItem,
    setVisible,
    surveyRepository.get,
    surveyRepository.save,
    getList,
    setList,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeDateField,
  ] = crudService.useChangeHandlers<Survey>(survey, setSurvey);

  // Default list

  const [defaultListQuestionType] = crudService.useEnumList<SurveyQuestionType>(
    surveyRepository.singleListSurveyQuestionType,
  );
  const [statusList] = crudService.useEnumList<Status>(
    surveyRepository.singleListStatus,
  );

  // reference
  const [
    surveyQuestionTypeFilter,
    setSurveyQuestionTypeFilter,
  ] = React.useState<SurveyQuestionTypeFilter>(new SurveyQuestionTypeFilter());

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  const handleKeyPress = React.useCallback(event => {
    if (event?.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  }, []);

  /* Add question*/
  const handleAddQuestion = React.useCallback(() => {
    const newQuestion = { ...new SurveyQuestion(), surveyQuestionTypeId: 1 };
    setSurvey(
      Survey.clone<Survey>({
        ...survey,
        surveyQuestions: [...(survey.surveyQuestions ?? []), newQuestion],
      }),
    );
  }, [setSurvey, survey]);

  /* Change question type*/
  const handleChangeSurveyQuestionType = React.useCallback(
    (index: number) => {
      return (id, type) => {
        survey.surveyQuestions[index].surveyQuestionTypeId = Number(id);
        survey.surveyQuestions[index].surveyQuestionType = type;
        survey.surveyQuestions[index].surveyOptions = [];
        setSurvey({ ...survey });
      };
    },
    [setSurvey, survey],
  );

  const handleChangeQuestion = React.useCallback(
    index => {
      return event => {
        survey.surveyQuestions[index].content = event?.target?.value;
        setSurvey({ ...survey });
      };
    },
    [setSurvey, survey],
  );

  const handleAddOption = React.useCallback(
    indexQuestion => {
      survey.surveyQuestions[indexQuestion] = {
        ...survey.surveyQuestions[indexQuestion],
        surveyOptions: [
          ...(survey.surveyQuestions[indexQuestion].surveyOptions ?? []),
          new SurveyOption(),
        ],
      };
      setSurvey(
        Survey.clone<Survey>({
          ...survey,
        }),
      );
    },
    [setSurvey, survey],
  );

  const handleDeleteOption = React.useCallback(
    (indexQuestion, indexOption) => {
      survey.surveyQuestions[indexQuestion].surveyOptions.splice(
        indexOption,
        1,
      );
      setSurvey({ ...survey });
    },
    [setSurvey, survey],
  );

  const handleDeleteQuestion = React.useCallback(
    (index: number) => {
      survey.surveyQuestions.splice(index, 1);
      setSurvey({ ...survey });
    },
    [setSurvey, survey],
  );

  const handleChangeMandatory = React.useCallback(
    (index: number) => {
      survey.surveyQuestions[index].isMandatory = !survey.surveyQuestions[index]
        .isMandatory;
      setSurvey({ ...survey });
    },
    [setSurvey, survey],
  );

  const handleChangeOptionSingle = React.useCallback(
    (indexQuestion, indexOption) => {
      return event => {
        survey.surveyQuestions[indexQuestion].surveyOptions[
          indexOption
        ].content = event?.target?.value;
        if (
          survey.surveyQuestions[indexQuestion].surveyQuestionTypeId === 1 ||
          survey.surveyQuestions[indexQuestion].surveyQuestionTypeId === 2
        ) {
          survey.surveyQuestions[indexQuestion].surveyOptions[
            indexOption
          ].surveyOptionTypeId = 1;
        }

        setSurvey({ ...survey });
      };
    },
    [setSurvey, survey],
  );

  // for upload image

  const handleChangeImages = React.useCallback(
    (questionIndex: number, survey: Survey, imageIndex: number) => (
      items: Image[],
    ) => {
      const image = [];

      if (items && items.length > 0) {
        items.forEach(item => {
          image.push({
            image: item,
            imageId: item.id,
          });
        });
      }

      survey.surveyQuestions[questionIndex].surveyQuestionImageMappings[
        imageIndex
      ] = image[0];

      setSurvey({ ...survey });
    },
    [setSurvey],
  );
  // add button upload image
  const handleAddImage = React.useCallback(
    (questionIndex: number, survey: Survey) => {
      survey.surveyQuestions[questionIndex].surveyQuestionImageMappings = [
        ...(survey.surveyQuestions[questionIndex].surveyQuestionImageMappings ??
          []),
        {
          imageId: 0,
          image: {
            id: 0,
            name: '',
            url: '',
            thumbnailUrl: '',
            rowId: '',
          },
        },
      ];
      setSurvey({ ...survey });
    },
    [setSurvey],
  );

  const handleDeleteImage = React.useCallback(
    (questionIndex: number, imageIndex: number, survey: Survey) => {
      survey.surveyQuestions[questionIndex].surveyQuestionImageMappings.splice(
        imageIndex,
        1,
      );
      setSurvey({ ...survey });
    },
    [setSurvey],
  );

  // for upload file

  const [storingFiles, setStoringFiles] = React.useState<any>([[]]);

  const handleChangeFiles = React.useCallback(
    (questionIndex: number, survey: Survey) => (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const newArray = [];
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        newArray.push(files[i]);
      }

      surveyRepository.uploadFiles(newArray).then((res: FileModel[]) => {
        survey.surveyQuestions[questionIndex].surveyQuestionFileMappings = [
          ...(survey.surveyQuestions[questionIndex]
            .surveyQuestionFileMappings ?? []),
          ...res.map((item: any) => {
            storingFiles[questionIndex].push(item);
            setStoringFiles([...storingFiles]);
            return {
              fileId: item.id,
              file: {
                ...item,
              },
            };
          }),
        ];

        const newSurvey = { ...survey };

        setSurvey(newSurvey);
      });
    },
    [setSurvey, storingFiles],
  );

  const handleDeleteFiles = React.useCallback(
    (questionIndex: number, survey: Survey, fileIndex: number) => {
      survey.surveyQuestions[questionIndex].surveyQuestionFileMappings.splice(
        fileIndex,
        1,
      );
      setSurvey({ ...survey });
    },
    [setSurvey],
  );

  const renderGeneralInformation = React.useMemo(() => {
    return () => (
      <>
        <Row className="mb-3" style={{ alignItems: 'flex-start' }}>
          <Col>
            <FormItem
              validateStatus={formService.getValidationStatus<Survey>(
                survey.errors,
                nameof(survey.title),
              )}
              help={
                survey.title === null || survey.title === ''
                  ? survey.errors?.title
                  : ''
              }
            >
              <span className="label-input ml-3">
                {translate('surveys.title')}
                <span className="text-danger">*</span>
              </span>
              <Input
                value={survey.title}
                onChange={handleChangeSimpleField(nameof(survey.title))}
                placeholder={translate('surveys.placeholder.title')}
                className="form-control form-control-sm"
                onPressEnter={handleKeyPress}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem
              validateStatus={formService.getValidationStatus<Survey>(
                survey.errors,
                nameof(survey.startAt),
              )}
              help={survey.errors?.startAt}
            >
              <span className="label-input ml-3">
                {translate('surveys.startAt')}
                <span className="text-danger">*</span>
              </span>
              <DatePicker
                value={formatInputDate(survey.startAt)}
                format={STANDARD_DATE_FORMAT_INVERSE}
                onChange={handleChangeDateField(nameof(survey.startAt))}
                className="w-100"
                placeholder={translate('surveys.placeholder.startAt')}
              />
            </FormItem>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <FormItem
              validateStatus={formService.getValidationStatus<Survey>(
                survey.errors,
                nameof(survey.description),
              )}
              help={
                survey.description === null || survey.description === ''
                  ? survey.errors?.description
                  : ''
              }
            >
              <span className="label-input ml-3">
                {translate('surveys.description')}
              </span>
              <Input
                value={survey.description}
                onChange={handleChangeSimpleField(nameof(survey.description))}
                placeholder={translate('surveys.placeholder.description')}
                className="form-control form-control-sm"
                onPressEnter={handleKeyPress}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem
              validateStatus={formService.getValidationStatus<Survey>(
                survey.errors,
                nameof(survey.endAt),
              )}
              help={survey.endAt < survey.startAt ? survey.errors?.endAt : ''}
            >
              <span className="label-input ml-3">
                {translate('surveys.endAt')}
              </span>
              <DatePicker
                value={formatInputDate(survey.endAt)}
                format={STANDARD_DATE_FORMAT_INVERSE}
                onChange={handleChangeDateField(nameof(survey.endAt))}
                className="w-100"
                placeholder={translate('surveys.placeholder.endAt')}
              />
            </FormItem>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col lg={6}>
            <FormItem className="mb-3">
              <span className="label-input ml-3">
                {translate('surveys.status')}
              </span>
              <SwitchStatus
                checked={survey.statusId === statusList[1]?.id}
                list={statusList}
                onChange={handleChangeObjectField(nameof(survey.status))}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormItem
              validateStatus={formService.getValidationStatus<Survey>(
                survey.errors,
                nameof(survey.surveyQuestions),
              )}
              help={survey.errors?.surveyQuestions}
              className="mb-2"
            ></FormItem>
          </Col>
        </Row>
        <Row className="mb-3">
          {displayAddButton && (
            <button
              className="btn btn-sm btn-outline-primary btn-add-question"
              onClick={handleAddQuestion}
              disabled={survey && survey.used && survey?.used === true}
            >
              <i className="fa fa-plus" />
            </button>
          )}

          <Col>
            <button
              className="btn btn-sm btn-primary ml-3 mr-2"
              onClick={handleAddQuestion}
              disabled={survey && survey.used && survey?.used === true}
            >
              <i className="fa mr-2 fa-plus" />
              {translate('surveys.actions.addSurvey')}
            </button>
          </Col>
        </Row>
      </>
    );
  }, [
    survey,
    translate,
    handleChangeSimpleField,
    handleKeyPress,
    handleChangeDateField,
    statusList,
    handleChangeObjectField,
    displayAddButton,
    handleAddQuestion,
  ]);

  const renderAddOptionQuestionType1 = React.useMemo(() => {
    return questionIndex => (
      <div className="add-option mt-3 ml-3">
        <div
          className="answer d-flex align-items-center"
          onClick={() => handleAddOption(questionIndex)}
        >
          <div className="circle" />
          <span className="ml-2 text-add-option">
            {translate('surveys.add.option')}
          </span>
        </div>
      </div>
    );
  }, [handleAddOption, translate]);

  const renderAddOptionForQuestionType2 = React.useMemo(() => {
    return questionIndex => (
      <div className="add-option mt-3 ml-3">
        <div
          className="answer d-flex align-items-center"
          onClick={() => handleAddOption(questionIndex)}
        >
          <div className="checkbox" />
          <span className="ml-2 text-add-option">
            {translate('surveys.add.option')}
          </span>
        </div>
      </div>
    );
  }, [handleAddOption, translate]);

  const handleAddRowOption = React.useCallback(
    (questionIndex, index) => {
      return () => {
        // console.log(`rowIndex: `, questionIndex, index);
        survey.surveyQuestions[questionIndex].surveyOptions.splice(index, 0, {
          ...new SurveyOption(),
          surveyOptionTypeId: 2,
        });
        setSurvey({ ...survey });
      };
    },
    [setSurvey, survey],
  );

  const handleAddColOption = React.useCallback(
    (questionIndex, index) => {
      return () => {
        survey.surveyQuestions[questionIndex].surveyOptions.splice(index, 0, {
          ...new SurveyOption(),
          surveyOptionTypeId: 3,
        });
        setSurvey({ ...survey });
      };
    },
    [setSurvey, survey],
  );

  const handleChangeOption = React.useCallback(
    (questionIndex, listIndex) => {
      return (ev: React.ChangeEvent<HTMLInputElement>) => {
        // tslint:disable-next-line:no-console
        survey.surveyQuestions[questionIndex].surveyOptions[listIndex].content =
          ev.currentTarget.value;
        setSurvey({ ...survey });
      };
    },
    [setSurvey, survey],
  );

  const handleDeleteRowOption = React.useCallback(
    (questionIndex, index) => {
      survey.surveyQuestions[questionIndex].surveyOptions.splice(index - 1, 1);
      setSurvey({ ...survey });
    },
    [setSurvey, survey],
  );

  const handleDeleteColOption = React.useCallback(
    (questionIndex, index) => {
      survey.surveyQuestions[questionIndex].surveyOptions.splice(index - 1, 1);
      setSurvey({ ...survey });
    },
    [setSurvey, survey],
  );

  const renderOptionForQuestionType3 = React.useMemo(() => {
    return (question: SurveyQuestion, questionIndex: number) => {
      // tslint:disable-next-line:no-console
      let indexedOptionList = [];
      if (question.surveyOptions && question.surveyOptions.length > 0) {
        indexedOptionList = question.surveyOptions.map((option, listIndex) => ({
          ...option,
          listIndex,
        }));
      }

      const rowOption = indexedOptionList.filter(
        option => option.surveyOptionTypeId === 2,
      );
      const colOption = indexedOptionList.filter(
        option => option.surveyOptionTypeId === 3,
      );

      return (
        <Row style={{ alignItems: 'flex-start' }}>
          <Col lg={6}>
            <div className="mt-3 ml-3">{translate('surveys.row')}</div>

            {rowOption.length > 0 &&
              rowOption.map((option, index) => (
                <div className="mt-3 ml-3" key={index}>
                  <div className="answer d-flex align-items-center">
                    {index + 1}.
                    <Tooltip title={`${option?.content ? option.content : ''}`}>
                      <FormItem
                        className="questions"
                        validateStatus={formService.getValidationStatus<
                          SurveyOption
                        >(option.errors, nameof(option.content))}
                        help={
                          option.content === null || option.content === ''
                            ? option.errors?.content
                            : ''
                        }
                      >
                        <Input
                          type="text"
                          onChange={handleChangeOption(
                            questionIndex,
                            option.listIndex,
                          )}
                          value={option.content}
                          className="form-control form-control-sm radio-input ml-2"
                          placeholder={
                            translate('surveys.placeholder.row') +
                            ` ${index + 1}`
                          }
                          onPressEnter={handleKeyPress}
                          disabled={
                            survey && survey.used && survey?.used === true
                          }
                          style={{ cursor: 'pointer' }}
                        />
                      </FormItem>
                    </Tooltip>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() =>
                        handleDeleteRowOption(questionIndex, rowOption.length)
                      }
                      disabled={survey && survey.used && survey?.used === true}
                    >
                      <img src="/dms/assets/icons/times-circle.svg" alt="" />
                    </button>
                  </div>
                </div>
              ))}
            {survey && !survey.used && (
              <div className="add-option mt-3 ml-3">
                <div
                  className="answer d-flex align-items-center"
                  onClick={handleAddRowOption(questionIndex, rowOption.length)}
                >
                  <i className="fa fa-plus" />
                  <span className="ml-2 text-add-option">
                    {translate('surveys.add.option')}
                  </span>
                </div>
              </div>
            )}
          </Col>
          <Col lg={6} style={{ paddingLeft: '54px' }}>
            <div className="mt-3">{translate('surveys.col')}</div>

            {colOption.length > 0 &&
              colOption.map((option, index) => (
                <div className="type-1 mt-3" key={index}>
                  <div className="answer d-flex align-items-center">
                    {question.surveyQuestionTypeId === 3 && (
                      <div className="circle" />
                    )}
                    {question.surveyQuestionTypeId === 4 && (
                      <div className="checkbox" />
                    )}
                    <Tooltip title={`${option?.content ? option.content : ''}`}>
                      <FormItem
                        className="questions"
                        validateStatus={formService.getValidationStatus<
                          SurveyOption
                        >(option.errors, nameof(option.content))}
                        help={
                          option.content === null || option.content === ''
                            ? option.errors?.content
                            : ''
                        }
                      >
                        <Input
                          value={option?.content}
                          onChange={handleChangeOption(
                            questionIndex,
                            option.listIndex,
                          )}
                          className="form-control form-control-sm type-3-input ml-2"
                          placeholder={
                            translate('surveys.placeholder.col') +
                            ` ${index + 1}`
                          }
                          onPressEnter={handleKeyPress}
                          disabled={
                            survey && survey.used && survey?.used === true
                          }
                          style={{ cursor: 'pointer' }}
                        />
                      </FormItem>
                    </Tooltip>

                    <button
                      className="btn btn-sm btn-link"
                      onClick={() =>
                        handleDeleteColOption(
                          questionIndex,
                          indexedOptionList.length,
                        )
                      }
                      disabled={survey && survey.used && survey?.used === true}
                    >
                      <img src="/dms/assets/icons/times-circle.svg" alt="" />
                    </button>
                  </div>
                </div>
              ))}
            {survey && !survey.used && (
              <div className="add-option mt-3">
                <div
                  className="answer d-flex align-items-center"
                  onClick={handleAddColOption(
                    questionIndex,
                    indexedOptionList.length,
                  )}
                >
                  {question.surveyQuestionTypeId === 3 && (
                    <div className="circle" />
                  )}
                  {question.surveyQuestionTypeId === 4 && (
                    <div className="checkbox" />
                  )}
                  <span className="ml-2 text-add-option">
                    {translate('surveys.add.option')}
                  </span>
                </div>
              </div>
            )}
          </Col>
        </Row>
      );
    };
  }, [
    handleAddColOption,
    handleAddRowOption,
    handleChangeOption,
    handleDeleteColOption,
    handleDeleteRowOption,
    translate,
    handleKeyPress,
    survey,
  ]);
  const renderAddOptionQuestionType5 = React.useMemo(() => {
    return questionIndex => (
      <div className="add-option mt-3 ml-3">
        <div
          className="answer d-flex align-items-center"
          onClick={() => handleAddOption(questionIndex)}
        ></div>
      </div>
    );
  }, [handleAddOption]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const el = event.target as HTMLDivElement;
    setDisplayAddButton(true);
    if (el.scrollTop === 0) {
      setDisplayAddButton(false);
    }
  }, []);
  // start of modal
  return (
    <div className="" onScroll={handleScroll}>
      <Modal
        className="form-modal-detail modal-survey"
        width={1000}
        title={
          <div className="d-flex justify-content-between modal-header align-items-center">
            <h5 className="d-flex align-items-center header-popup">
              {isDetail === false
                ? translate(generalLanguageKeys.actions.create)
                : translate('surveys.detail.title', props?.currentItem)}
            </h5>
            <div className="d-flex justify-content-end mr-3">
              {!isDetail && validAction('create') && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
              {isDetail && validAction('update') && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </div>
        }
        visible={visible}
        onOk={handleSave}
        onCancel={handleCancel}
        closable={false}
        footer={
          <>
            {survey?.surveyQuestions && survey?.surveyQuestions.length > 0 && (
              <div className="d-flex justify-content-end mr-3 container">
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary ml-2"
                  onClick={handleCancel}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
              </div>
            )}
          </>
        }
      >
        <div className="container">
          <Form>
            {/* render general information */}
            {renderGeneralInformation()}
            {survey?.surveyQuestions &&
              survey?.surveyQuestions.length > 0 &&
              survey?.surveyQuestions.map(
                (surveyQuestion: SurveyQuestion, index: number) => {
                  return (
                    <div className="survey" key={index}>
                      <Row
                        style={{
                          alignItems: surveyQuestion.errors?.content
                            ? 'flex-start'
                            : 'center',
                        }}
                      >
                        <Col sm={8}>
                          <FormItem
                            className="questions"
                            validateStatus={formService.getValidationStatus<
                              SurveyQuestion
                            >(
                              surveyQuestion.errors,
                              nameof(surveyQuestion.content),
                            )}
                            help={
                              surveyQuestion.content === null ||
                              surveyQuestion.content === ''
                                ? surveyQuestion.errors?.content
                                : ''
                            }
                          >
                            <Input
                              value={surveyQuestion.content}
                              onChange={handleChangeQuestion(index)}
                              placeholder={translate(
                                'surveys.placeholder.content',
                              )}
                              className="form-control form-control-sm ml-3"
                              onPressEnter={handleKeyPress}
                              disabled={
                                survey && survey.used && survey?.used === true
                              }
                            />
                          </FormItem>
                        </Col>

                        <Col
                          style={{
                            marginTop: surveyQuestion.errors?.content
                              ? '8px'
                              : '0px',
                          }}
                        >
                          <Row>
                            <Col
                              style={{
                                paddingLeft: '0px',
                                paddingRight: '0px',
                              }}
                            >
                              {' '}
                              <Tooltip title={'Attach Images'}>
                                <div
                                  style={{ textAlign: 'center' }}
                                  onClick={() => {
                                    handleAddImage(index, survey);
                                  }}
                                >
                                  <span
                                    className="iconify"
                                    data-icon="akar-icons:image"
                                    data-inline="false"
                                  ></span>
                                </div>
                              </Tooltip>
                            </Col>
                            <Col
                              style={{
                                paddingLeft: '0px',
                                paddingRight: '0px',
                              }}
                            >
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                multiple
                                onChange={handleChangeFiles(index, survey)}
                                id={`survey-file-${index}`}
                              />
                              <Tooltip title={'Attach Files'}>
                                <div
                                  style={{ textAlign: 'center' }}
                                  onClick={() => {
                                    document
                                      .getElementById(`survey-file-${index}`)
                                      .click();
                                  }}
                                >
                                  <span
                                    className="iconify"
                                    data-icon="akar-icons:attach"
                                    data-inline="false"
                                  ></span>
                                </div>
                              </Tooltip>
                            </Col>
                            &nbsp;
                          </Row>
                        </Col>

                        <Col sm={3} style={{ paddingLeft: '0px' }}>
                          <FormItem>
                            <SelectAutoComplete
                              value={
                                surveyQuestion?.surveyQuestionType?.id || 1
                              }
                              onChange={handleChangeSurveyQuestionType(index)}
                              getList={
                                surveyRepository.singleListSurveyQuestionType
                              }
                              modelFilter={surveyQuestionTypeFilter}
                              setModelFilter={setSurveyQuestionTypeFilter}
                              searchField={nameof(
                                surveyQuestionTypeFilter.name,
                              )}
                              searchType={nameof(
                                surveyQuestionTypeFilter.name.contain,
                              )}
                              placeholder={translate(
                                'surveys.placeholder.surveyQuestionType',
                              )}
                              className="w-100 ml-3"
                              list={defaultListQuestionType}
                              disabled={
                                survey && survey.used && survey?.used === true
                              }
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row style={{ alignItems: 'flex-start' }}>
                        <Col sm={8}>
                          {surveyQuestion.surveyQuestionImageMappings &&
                            surveyQuestion.surveyQuestionImageMappings.length >
                              0 &&
                            surveyQuestion.surveyQuestionImageMappings.map(
                              (image: Image, imageIndex: number) => {
                                return (
                                  <Row key={imageIndex}>
                                    <Col sm={10}>
                                      <div id={`list-survey-image-${index}`}>
                                        <div
                                          id={`survey-image-${image?.imageId}`}
                                        >
                                          <ImageUpload
                                            defaultItems={[image?.image]}
                                            limit={1}
                                            aspectRatio={1.5}
                                            onUpload={
                                              surveyRepository.uploadImage
                                            }
                                            onChange={handleChangeImages(
                                              index,
                                              survey,
                                              imageIndex,
                                            )}
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                    <Col>
                                      <div
                                        onClick={() =>
                                          handleDeleteImage(
                                            index,
                                            imageIndex,
                                            survey,
                                          )
                                        }
                                      >
                                        <span
                                          className="iconify"
                                          data-icon="akar-icons:trash-can"
                                          data-inline="false"
                                        ></span>
                                      </div>
                                    </Col>
                                  </Row>
                                );
                              },
                            )}
                        </Col>

                        <Col
                          sm={3}
                          style={{ marginTop: '20px', paddingLeft: '0px' }}
                        >
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            {surveyQuestion.surveyQuestionFileMappings &&
                              surveyQuestion.surveyQuestionFileMappings.length >
                                0 &&
                              surveyQuestion.surveyQuestionFileMappings.map(
                                (fileItem: any, fileIndex: number) => (
                                  <div
                                    key={fileIndex}
                                    className={'survey-question__file-item'}
                                  >
                                    <a
                                      className={'survey-question__file-link'}
                                      href={`${
                                        fileItem.file?.path
                                          ? fileItem.file?.path
                                          : storingFiles[index][fileIndex]?.path
                                          ? storingFiles[index][fileIndex].path
                                          : ''
                                      }`}
                                    >{`${
                                      fileItem.file?.name
                                        ? fileItem.file?.name
                                        : storingFiles[index][fileIndex]?.name
                                        ? storingFiles[index][fileIndex].name
                                        : ''
                                    }`}</a>
                                    <Tooltip title={'Xóa'}>
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                          handleDeleteFiles(
                                            index,
                                            survey,
                                            fileIndex,
                                          )
                                        }
                                      >
                                        x
                                      </span>
                                    </Tooltip>
                                  </div>
                                ),
                              )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {surveyQuestion?.surveyQuestionTypeId === 1 &&
                            surveyQuestion.surveyOptions &&
                            surveyQuestion?.surveyOptions.length > 0 &&
                            surveyQuestion?.surveyOptions.map(
                              (
                                surveyOption: SurveyOption,
                                indexOption: number,
                              ) => (
                                <div
                                  className="answer d-flex align-items-center mt-3 ml-3"
                                  key={indexOption}
                                >
                                  <div className="circle" />
                                  <Tooltip
                                    title={`${
                                      surveyOption?.content
                                        ? surveyOption.content
                                        : ''
                                    }`}
                                  >
                                    <FormItem
                                      className="questions"
                                      validateStatus={formService.getValidationStatus<
                                        SurveyOption
                                      >(
                                        surveyOption.errors,
                                        nameof(surveyOption.content),
                                      )}
                                      help={
                                        surveyOption.content === null ||
                                        surveyOption.content === ''
                                          ? surveyOption.errors?.content
                                          : ''
                                      }
                                    >
                                      <Input
                                        value={surveyOption?.content}
                                        onChange={handleChangeOptionSingle(
                                          index,
                                          indexOption,
                                        )}
                                        className="form-control form-control-sm radio-input ml-2"
                                        placeholder={
                                          translate(
                                            'surveys.placeholder.option',
                                          ) + ` ${indexOption + 1}`
                                        }
                                        onPressEnter={handleKeyPress}
                                        disabled={
                                          survey &&
                                          survey.used &&
                                          survey?.used === true
                                        }
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </FormItem>
                                  </Tooltip>

                                  <button
                                    className="btn btn-sm btn-link"
                                    onClick={() =>
                                      handleDeleteOption(index, indexOption)
                                    }
                                    disabled={
                                      survey &&
                                      survey.used &&
                                      survey?.used === true
                                    }
                                  >
                                    <img
                                      src="/dms/assets/icons/times-circle.svg"
                                      alt=""
                                    />
                                  </button>
                                </div>
                              ),
                            )}
                          {surveyQuestion?.surveyQuestionTypeId === 2 &&
                            surveyQuestion.surveyOptions &&
                            surveyQuestion?.surveyOptions.length > 0 &&
                            surveyQuestion?.surveyOptions.map(
                              (
                                surveyOption: SurveyOption,
                                indexOption: number,
                              ) => (
                                <div
                                  className="answer d-flex align-items-center mt-3 ml-3"
                                  key={indexOption}
                                >
                                  <div className="checkbox" />
                                  <Tooltip
                                    title={`${
                                      surveyOption?.content
                                        ? surveyOption.content
                                        : ''
                                    }`}
                                  >
                                    <FormItem
                                      className="questions"
                                      validateStatus={formService.getValidationStatus<
                                        SurveyOption
                                      >(
                                        surveyOption.errors,
                                        nameof(surveyOption.content),
                                      )}
                                      help={
                                        surveyOption.content === null ||
                                        surveyOption.content === ''
                                          ? surveyOption.errors?.content
                                          : ''
                                      }
                                    >
                                      <Input
                                        value={surveyOption?.content}
                                        onChange={handleChangeOptionSingle(
                                          index,
                                          indexOption,
                                        )}
                                        className="form-control form-control-sm radio-input ml-2"
                                        placeholder={translate(
                                          'surveys.placeholder.content',
                                        )}
                                        onPressEnter={handleKeyPress}
                                        disabled={
                                          survey &&
                                          survey.used &&
                                          survey?.used === true
                                        }
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </FormItem>
                                  </Tooltip>

                                  <button
                                    className="btn btn-sm btn-link"
                                    onClick={() =>
                                      handleDeleteOption(index, indexOption)
                                    }
                                    disabled={
                                      survey &&
                                      survey.used &&
                                      survey?.used === true
                                    }
                                  >
                                    <img
                                      src="/dms/assets/icons/times-circle.svg"
                                      alt=""
                                    />
                                  </button>
                                </div>
                              ),
                            )}
                          {(surveyQuestion?.surveyQuestionTypeId === 3 ||
                            surveyQuestion?.surveyQuestionTypeId === 4) &&
                            renderOptionForQuestionType3(surveyQuestion, index)}
                          {/* render add option for question type1 */}
                          {surveyQuestion?.surveyQuestionTypeId === 1 &&
                            survey &&
                            !survey.used &&
                            renderAddOptionQuestionType1(index)}

                          {/* render add option for question type2 */}
                          {surveyQuestion?.surveyQuestionTypeId === 2 &&
                            survey &&
                            !survey.used &&
                            renderAddOptionForQuestionType2(index)}
                          {/* render add option for question type5 */}
                          {surveyQuestion?.surveyQuestionTypeId === 5 && (
                            <div className="answer d-flex align-items-center mt-3 ml-3">
                              <FormItem className="questions">
                                <Input
                                  value={survey?.content}
                                  className="form-control form-control-sm radio-input-text ml-2"
                                  placeholder={translate(
                                    'surveys.placeholder.optionText',
                                  )}
                                  disabled={true}
                                />
                              </FormItem>
                            </div>
                          )}
                          {surveyQuestion?.surveyQuestionTypeId === 5 &&
                            survey &&
                            !survey.used &&
                            renderAddOptionQuestionType5(index)}
                          <FormItem
                            className="questions"
                            validateStatus={formService.getValidationStatus<
                              SurveyQuestion
                            >(
                              surveyQuestion.errors,
                              nameof(surveyQuestion.surveyOptions),
                            )}
                            help={
                              surveyQuestion.surveyOptions === null ||
                              (surveyQuestion.surveyOptions &&
                                surveyQuestion.surveyOptions.length === 0)
                                ? surveyQuestion.errors?.surveyOptions
                                : ''
                            }
                          ></FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="footer-questions mt-4">
                            <button
                              className="btn btn-lg btn-link"
                              onClick={() => handleDeleteQuestion(index)}
                              disabled={
                                survey && survey.used && survey?.used === true
                              }
                            >
                              <i className="fa fa-trash" />
                            </button>
                            <Switch
                              disabled={
                                survey && survey.used && survey?.used === true
                              }
                              className="float-right"
                              checked={surveyQuestion.isMandatory === true}
                              onChange={() => handleChangeMandatory(index)}
                            />
                            <div className="float-right mt-2 mr-3 pt-1">
                              {translate('surveys.isMandatory')}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                },
              )}
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default SurveyDetail;
