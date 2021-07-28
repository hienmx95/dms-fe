import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import FormItem from 'antd/lib/form/FormItem';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { Action } from 'models/Action';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { Permission } from 'models/Permission';
import { PermissionActionMapping } from 'models/PermissionActionMapping';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import PermissionActionMappingTable from './PermissionActionMappingTable';
import PermissionContentTable from './PermissionContentTable';
import { FieldFilter } from 'models/FieldFilter';
import Tabs from 'antd/lib/tabs';
import './PermissionRoleDetail.scss';
import { API_ROLE_ROUTE } from 'config/api-consts';

const { TabPane } = Tabs;

export interface PermissionDetailModalProps extends ModalProps {
  onSave?: () => void;
  onClose?: () => void;
  statusList: Status[];
  currentItem: Permission;
  setCurrentItem?: Dispatch<SetStateAction<Permission>>;
}
function PermissionDetailModal(props: PermissionDetailModalProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('role', API_ROLE_ROUTE);
  const {
    isOpen,
    onSave,
    toggle,
    onClose,
    statusList,
    currentItem,
    setCurrentItem,
  } = props;

  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  // React.useEffect(() => {
  //   console.log(`currentItem`, currentItem);
  // }, [currentItem]);

  const [menuId, setMenuId] = React.useState<number | undefined>(undefined);
  const [listAction, setListAction] = React.useState<Action[]>([]);
  const [loadMapping, setLoadMapping] = React.useState<boolean>(false);
  const [fieldFilter, setFieldFilter] = React.useState<FieldFilter>(
    new FieldFilter(),
  );

  const [
    permissionActionMappings,
    setPermissionActionMappings,
  ] = crudService.useContentTable<Permission, PermissionActionMapping>(
    currentItem,
    setCurrentItem,
    nameof(currentItem.permissionActionMappings),
  );

  const rowSelection = tableService.useModalRowSelection<
    Action,
    PermissionActionMapping
  >(
    currentItem.id,
    nameof(currentItem),
    nameof(permissionActionMappings[0].action),
    permissionActionMappings,
    setPermissionActionMappings,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Permission>(currentItem, setCurrentItem);

  const handleChangeMenu = React.useCallback(
    (id: number, menu: Menu) => {
      setMenuId(id);
      /* reset menu, menuId, permissionContent */
      setCurrentItem({
        ...currentItem,
        menuId: id,
        menu,
        permissionContents: [],
        permissionActionMappings: [],
      });
      setFieldFilter({
        ...fieldFilter,
        menuId: { equal: id },
      });
      setLoadMapping(true);
    },
    [currentItem, fieldFilter, setCurrentItem],
  );

  React.useEffect(() => {
    if (currentItem.menu) {
      setMenuId(currentItem.menu.id);
      /* default filter by menuId in fieldFilter */
      setFieldFilter({
        ...new FieldFilter(),
        menuId: { equal: currentItem.menu.id },
      });
      setLoadMapping(true);
    } else {
      setListAction([]);
    }
  }, [currentItem.menu]);

  React.useEffect(() => {
    if (loadMapping) {
      if (menuId) {
        roleRepository
          .getMenu(menuId)
          .then((item: Menu) => {
            if (item) {
              if (item.actions && item.actions.length > 0) {
                setListAction(item.actions);
              }
            }
          })
          .finally(() => {
            setLoadMapping(false);
          });
      } else {
        setListAction([]);
        setLoadMapping(false);
      }
    }
  }, [loadMapping, currentItem, menuId]);

  return (
    <>
      <Modal size="xl" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
        <ModalBody>
          <Card
            title={
              <>
                {translate('permissions.detail.title')}
                <button
                  className="btn btn-sm btn-outline-primary float-right mr-2 "
                  onClick={onClose}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                {validAction('createPermission') && (
                  <button
                    className="btn btn-sm btn-primary float-right mr-2"
                    onClick={onSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
              </>
            }
          >
            <Form className="form-modal-detail role-detail">
              {/* code & name */}
              <Row>
                <Col span={11}>
                  <div className="p-2">
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        Permission
                      >(currentItem.errors, nameof(currentItem.code))}
                      help={currentItem.errors?.code}
                      className="form-validate"
                    >
                      <span className="label-input">
                        {translate('permissions.code')}
                        <span className="text-danger">*</span>
                      </span>
                      <Input
                        type="text"
                        value={currentItem.code}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(currentItem.code),
                        )}
                        placeholder={translate('permissions.code')}
                      />
                    </FormItem>
                    {validAction('singleListMenu') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          Permission
                        >(currentItem.errors, nameof(currentItem.menu))}
                        help={currentItem.errors?.menu}
                        className="form-validate"
                      >
                        <span className="label-input">
                          {translate('permissions.menu')}
                          {/* <span className="text-danger">*</span> */}
                        </span>

                        <SelectAutoComplete
                          value={currentItem.menu?.id}
                          onChange={handleChangeMenu}
                          getList={roleRepository.singleListMenu}
                          modelFilter={menuFilter}
                          setModelFilter={setMenuFilter}
                          searchField={nameof(menuFilter.name)}
                          searchType={nameof(menuFilter.name.contain)}
                          placeholder={translate(
                            'permissions.placeholder.menu',
                          )}
                        />
                      </FormItem>
                    )}
                  </div>
                </Col>
                <Col span={2} />
                <Col span={11}>
                  <div className="p-2">
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        Permission
                      >(currentItem.errors, nameof(currentItem.name))}
                      help={currentItem.errors?.name}
                      className="form-validate"
                    >
                      <span className="label-input">
                        {translate('permissions.name')}
                        <span className="text-danger">*</span>
                      </span>
                      <Input
                        type="text"
                        value={currentItem.name}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(currentItem.name),
                        )}
                        placeholder={translate('permissions.name')}
                      />
                    </FormItem>
                    {validAction('singleListStatus') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          Permission
                        >(currentItem.errors, nameof(currentItem.status))}
                        help={currentItem.errors?.status}
                      >
                        <div className="label-input">
                          {translate('permissions.status')}
                        </div>
                        <Switch
                          checked={
                            currentItem.statusId === statusList[1]?.id
                              ? true
                              : false
                          }
                          list={statusList}
                          onChange={handleChangeObjectField(
                            nameof(currentItem.status),
                          )}
                        />
                      </FormItem>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Tabs defaultActiveKey="1" className="tab mt-3">
                  <TabPane key="1" tab={translate('permissions.action')}>
                    <PermissionActionMappingTable
                      list={listAction}
                      rowSelection={rowSelection}
                    />
                  </TabPane>
                  <TabPane key="2" tab={translate('permissions.field')}>
                    <PermissionContentTable
                      permission={currentItem}
                      setPermission={setCurrentItem}
                      menuId={currentItem.menuId}
                    />
                  </TabPane>
                </Tabs>
              </Row>
            </Form>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
}

export default PermissionDetailModal;
