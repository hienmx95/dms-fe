import Form from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import './StoreScoutingTypeDetail.scss';
import { API_STORE_SCOUTING_TYPE_ROUTE } from 'config/api-consts';
import { StoreScoutingType } from 'models/StoreScoutingType';
import { StoreScoutingTypeFilter } from 'models/StoreScoutingTypeFilter';
import { storeScoutingTypeRepository } from '../StoreScoutingTypeRepository';
import { Input } from 'antd';
export interface StoreScoutingTypeDetaillProps<T, TFilter> {
    visible?: boolean;
    setVisible?: Dispatch<SetStateAction<boolean>>;
    getListStoreScoutingType?: (filter: TFilter) => Promise<T[]>;

    setListStoreScoutingType?: Dispatch<SetStateAction<T[]>>;
    currentItem?: T;
    onClose?: (event) => void;
    isDetail?: boolean;
    setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function StoreScoutingTypeDetail<
    T extends Model,
    TFilter extends ModelFilter
>(props: StoreScoutingTypeDetaillProps<T, TFilter>) {

    const { validAction } = crudService.useAction(
        'store-scouting-type',
        API_STORE_SCOUTING_TYPE_ROUTE,
    );

    const {
        isDetail,
        currentItem,
        visible,
        setVisible,
        getListStoreScoutingType,
        setListStoreScoutingType,
        setLoadList,
    } = props;

    const [translate] = useTranslation();

    const [
        storeScoutingType,
        setStoreScoutingType,
        ,
        ,
        handleSave,
    ] = crudService.usePopupDetail(
        StoreScoutingType,
        StoreScoutingTypeFilter,
        isDetail,
        currentItem,
        setVisible,
        storeScoutingTypeRepository.get,
        storeScoutingTypeRepository.save,
        getListStoreScoutingType,
        setListStoreScoutingType,
        setLoadList,
    );

    const [
        handleChangeSimpleField,
        handleChangeObjectField,
    ] = crudService.useChangeHandlers<StoreScoutingType>(
        storeScoutingType,
        setStoreScoutingType,
    );

    const [statusList] = crudService.useEnumList<Status>(
        storeScoutingTypeRepository.singleListStatus,
    );

    const handleCancel = React.useCallback(
        event => {
            if (props.onClose) {
                props.onClose(event);
            }
        },
        [props],
    );

    return (
        <>
            <Modal isOpen={visible} toggle={handleCancel} className="form-modal-detail">
                <ModalHeader className="title-header-popup">
                    {isDetail === false
                        ? translate('storeScoutingTypes.detail.addNode')
                        : translate('storeScoutingTypes.detail.edit', props?.currentItem)}
                </ModalHeader>
                <ModalBody>
                    <Form >
                        <Col>
                            <FormItem className="mb-3"
                                validateStatus={formService.getValidationStatus<StoreScoutingType>(
                                    storeScoutingType.errors,
                                    nameof(storeScoutingType.code),
                                )}
                                help={storeScoutingType.errors?.code}
                            >
                                <span className="label-input mr-3">
                                    {translate('storeScoutingTypes.code')}
                                    <span className="text-danger"> *</span>
                                </span>
                                <Input
                                    type="text"
                                    value={storeScoutingType.code}
                                    className="form-control form-control-sm"
                                    onChange={handleChangeSimpleField(nameof(storeScoutingType.code))}
                                    placeholder={translate('storeScoutingTypes.placeholder.code')}
                                />
                            </FormItem>
                            <FormItem className="mb-3"
                                validateStatus={formService.getValidationStatus<StoreScoutingType>(
                                    storeScoutingType.errors,
                                    nameof(storeScoutingType.name),
                                )}
                                help={storeScoutingType.errors?.name}
                            >
                                <span className="label-input mr-3">
                                    {translate('storeScoutingTypes.name')}
                                    <span className="text-danger"> *</span>
                                </span>
                                <Input
                                    type="text"
                                    value={storeScoutingType.name}
                                    className="form-control form-control-sm"
                                    onChange={handleChangeSimpleField(nameof(storeScoutingType.name))}
                                    placeholder={translate('storeScoutingTypes.placeholder.name')}
                                />
                            </FormItem>
                            <FormItem className="mb-3"
                            >
                                <span className="label-input mr-3">
                                    {translate('storeScoutingTypes.status')}
                                </span>
                                {validAction('singleListStatus') && (
                                    <Switch
                                        checked={
                                            // typeof problemType.status?.id === 'number' &&
                                            storeScoutingType.statusId === statusList[1]?.id
                                        }
                                        list={statusList}
                                        onChange={handleChangeObjectField(nameof(storeScoutingType.status))}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <div className="d-flex justify-content-end mt-4 mr-3">
                            {!isDetail && validAction('create') && <button
                                className="btn btn-sm btn-primary float-right"
                                onClick={handleSave}
                            >
                                <i className="fa mr-2 fa-save" />
                                {translate(generalLanguageKeys.actions.save)}
                            </button>
                            }

                            {isDetail && validAction('update') &&
                                <button
                                    className="btn btn-sm btn-primary float-right"
                                    onClick={handleSave}
                                >
                                    <i className="fa mr-2 fa-save" />
                                    {translate(generalLanguageKeys.actions.save)}
                                </button>
                            }
                            <button
                                className="btn btn-sm btn-outline-primary ml-2"
                                onClick={handleCancel}
                            >
                                <i className="fa mr-2 fa-times-circle" />
                                {translate(generalLanguageKeys.actions.cancel)}
                            </button>
                        </div>
                    </Form>
                </ModalBody>

            </Modal>
        </>
    );
}

export default StoreScoutingTypeDetail;
