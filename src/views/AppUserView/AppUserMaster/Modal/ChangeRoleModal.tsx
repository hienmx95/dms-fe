import { Col, Form, Popconfirm, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps } from 'antd/lib/table';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { API_APP_USER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalHeader } from 'reactstrap';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import nameof from 'ts-nameof.macro';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import './Modal.scss';

export interface ContentModalProps<T extends Model> extends ModalProps {
    model?: T;
    loading?: boolean;
    onSave?: (selectedList: Role[]) => void;
    onClose?: () => void;
}

function ChangeRoleModal<T extends Model>(props: ContentModalProps<T>) {
    const [translate] = useTranslation();
    const { validAction } = crudService.useAction(
        'app-user',
        API_APP_USER_ROUTE,
    );

    const {
        model,
        toggle,
        isOpen,
        onSave,
        loading,
        onClose,
    } = props;
    const [roleFilter, setRoleFilter] = React.useState<RoleFilter>(
        new RoleFilter(),
    );

    const [selectedList, setSelectedList] = React.useState<Role[]>([]);
    const [role, setRole] = React.useState<Role>(new Role());
    const [isRole, setIsRole] = React.useState<boolean>(true);
    const ref = React.useRef<boolean>(true);

    React.useEffect(() => {

        if (isOpen) {
            if (isRole) {
                setRole(new Role());
                setIsRole(false);
            }
            if (ref.current) {
                if (model?.appUserRoleMappings && model?.appUserRoleMappings.length > 0) {
                    const selected = model?.appUserRoleMappings.map((item: Role) => item?.role);
                    setSelectedList(selected);
                    const ids = selected.map(role => role.id);
                    roleFilter.id.notIn = ids;
                    setRoleFilter({ ...roleFilter });
                    ref.current = false;

                } else {
                    setSelectedList([]);
                    ref.current = false;
                }
            }
        } else {
            ref.current = true;
        }
    }, [
        isOpen,
        model,
        setSelectedList,
        model.appUserRoleMappings,
        roleFilter,
        isRole,
        selectedList,
    ]);

    const handleClose = React.useCallback(() => {
        setRole(new Role());
        onClose();
    }, [onClose]);

    const handleSave = React.useCallback(
        () => {

            if (typeof onSave === 'function') {
                setRole(new Role());
                onSave(selectedList);
            }

        }, [onSave, selectedList]);
    const handleDeleteItem = React.useCallback(
        index => {
            if (index > -1) {
                selectedList.splice(index, 1);
            }
            setSelectedList([...selectedList]);
            setRole(new Role());
        },
        [selectedList],
    );

    const handleChangeRole = React.useCallback(
        (...[, object]) => {
            setRole(object);
        }, []);

    const handleAddRole = React.useCallback(
        () => {
            if (role?.id !== undefined) {
                const ids = selectedList.map(role => role.id);
                if (!ids.includes(role.id)) {
                    selectedList.push(role);
                    setSelectedList([...selectedList]);
                }
                roleFilter.id.notIn = ids;
                setRoleFilter({ ...roleFilter });
            }
        }, [role, selectedList, roleFilter]);

    const columns: ColumnProps<Role>[] = React.useMemo(() => {
        return [
            {
                title: translate(generalLanguageKeys.columns.index),
                key: nameof(generalLanguageKeys.index),
                width: 70,
                render: renderMasterIndex<Role>(),
            },
            {
                title: translate('roles.code'),
                key: nameof(selectedList[0].code),
                dataIndex: nameof(selectedList[0].code),

                ellipsis: true,
            },
            {
                title: translate('roles.name'),
                key: nameof(selectedList[0].name),
                dataIndex: nameof(selectedList[0].name),
                ellipsis: true,
            },
            {
                title: translate(generalLanguageKeys.actions.label),
                key: nameof(generalLanguageKeys.columns.actions),
                dataIndex: nameof(selectedList[0].id),
                width: generalColumnWidths.actions,
                align: 'center',
                render(...[, , index]) {
                    return (
                        <div className="d-flex justify-content-center button-action-table">
                            <Popconfirm
                                placement="top"
                                title={translate('general.delete.content')}
                                onConfirm={() => handleDeleteItem(index)}
                                okText={translate('general.actions.delete')}
                                cancelText={translate('general.actions.cancel')}
                            >
                                <button className="btn btn-sm btn-link">
                                    <i className="tio-delete_outlined" />
                                </button>
                            </Popconfirm>
                        </div>
                    );
                },
            },
        ];
    }, [handleDeleteItem, selectedList, translate]);

    return (

        <ModalContent
            size="xl"
            isOpen={isOpen}
            backdrop="static"
            toggle={toggle}
            unmountOnClose={true}
        >
            <ModalHeader>{translate('appUsers.roles.title') + ` ${model?.username}`}</ModalHeader>
            <ModalBody>
                <Form className="page detail-page">
                    <Row className="ml-2 mr-3">
                        <Col span={4} />
                        <Col span={12}>
                            {validAction('listRole') &&
                                <FormItem
                                >
                                    <span className="label-input ml-3">{translate('appUsers.role')}</span>
                                    <SelectAutoComplete
                                        value={role?.id}
                                        onChange={handleChangeRole}
                                        getList={appUserRepository.listRole}
                                        modelFilter={roleFilter}
                                        setModelFilter={setRoleFilter}
                                        searchField={nameof(roleFilter.name)}
                                        searchType={nameof(roleFilter.name.contain)}
                                        placeholder={translate('appUsers.placeholder.role')}
                                    />
                                </FormItem>
                            }
                        </Col>
                        <Col span={4}>
                            <button
                                className="btn btn-sm btn-primary mr-2 mt-3"
                                onClick={handleAddRole}
                            >
                                <i className="fa mr-2 fa-plus" />
                                {translate('appUsers.roles.add')}
                            </button>
                        </Col>
                        <Col span={4} />
                    </Row>
                </Form>
                <Table
                    key={selectedList[0]?.id}
                    tableLayout="fixed"
                    columns={columns}
                    dataSource={selectedList}
                    loading={loading}
                    rowKey={nameof(selectedList[0].id)}
                    className="ml-4 mr-4"
                />
            </ModalBody>

            <ModalFooter>
                <div className="d-flex justify-content-end mt-4 mr-3">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={handleSave}
                    >
                        <i className="fa mr-2 fa-save" />
                        {translate(generalLanguageKeys.actions.save)}
                    </button>
                    <button
                        className="btn btn-sm btn-outline-primary ml-2"
                        onClick={handleClose}
                    >
                        <i className="fa mr-2 fa-times-circle" />
                        {translate(generalLanguageKeys.actions.cancel)}
                    </button>
                </div>
            </ModalFooter>
        </ModalContent >
    );
}

export default ChangeRoleModal;
