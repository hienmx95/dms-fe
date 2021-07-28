import { Col, Menu, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import MultiSelect, { DefaultOptionValue } from 'components/SelectMultiWithTag/SelectMultiWithTag';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { Field } from 'models/Field';
import { MenuFilter } from 'models/MenuFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { RequestState } from 'models/RequestState';
import { RequestStateFilter } from 'models/RequestStateFilter';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Sex } from 'models/Sex';
import { SexFilter } from 'models/SexFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { roleRepository } from 'views/RoleView/RoleRepository';
import './InputStyle.scss';

export interface IdFilterInputProps {
  item: Field;
  handleList?: (value: string[] | number[]) => void;
  currentItem?: PermissionFieldMapping;
  value?: string;
}

function IdFieldInput(props: IdFilterInputProps) {
  const [translate] = useTranslation();
  const { item, handleList, value } = props;
  const [organizationDefaultList, setOrganizationDefaultList] = React.useState<
    Organization[]
  >([]);
  const [roleDefaultList, setRoleDefaultList] = React.useState<Role[]>([]);
  const [menuDefaultList, setMenuDefaultList] = React.useState<Menu[]>([]);
  const [sexDefaultList, setSexDefaultList] = React.useState<Sex[]>([]);
  const [appUserDefaultList, setAppUserDefaultList] = React.useState<AppUser[]>(
    [],
  );
  const [supplierDefaultList, setSupplierDefaultList] = React.useState<
    Supplier[]
  >([]);
  const [parentStoreDefaultList, setParentStoreDefaultList] = React.useState<
    Store[]
  >([]);
  const [storeTypeDefaultList, setStoreTypeDefaultList] = React.useState<
    StoreType[]
  >([]);
  const [
    storeGroupingDefaultList,
    setStoreGroupingDefaultList,
  ] = React.useState<StoreGrouping[]>([]);
  const [productTypeDefaultList, setProductTypeDefaultList] = React.useState<
    ProductType[]
  >([]);
  const [brandDefaultList, setBrandDefaultList] = React.useState<Brand[]>([]);
  const [requestStateDefaultList, setRequestStateDefaultList] = React.useState<
    RequestState[]
  >([]);

  React.useEffect(() => {
    if (item) {
      if (value) {
        // convert value from string to array id
        const defaultListId =
          value.length > 0
            ? value.split(';').map(item => {
                if (typeof item === 'string') return +item;
                return item;
              })
            : [];
        switch (item.name.trim()) {
          // OrganizationId
          case 'OrganizationId': {
            const filter = new OrganizationFilter();
            filter.id.in = defaultListId;
            roleRepository
              .singleListOrganization(filter)
              .then((list: Organization[]) => {
                setOrganizationDefaultList(list);
              });
            break;
          }
          // RoleId
          case 'RoleId': {
            const filter = new RoleFilter();
            filter.id.in = defaultListId;
            roleRepository.singleListRole(filter).then((list: Role[]) => {
              setRoleDefaultList(list);
            });
            break;
          }
          // MenuId
          case 'MenuId': {
            const filter = new MenuFilter();
            filter.id.in = defaultListId;
            roleRepository.singleListMenu(filter).then((list: Menu[]) => {
              setMenuDefaultList(list);
            });
            break;
          }
          // SexId
          case 'SexId': {
            const filter = new SexFilter();
            filter.id.in = defaultListId;
            roleRepository.singleListSex(filter).then((list: Sex[]) => {
              setSexDefaultList(list);
            });
            break;
          }
          // CreatorId, PersonInChargeId, StaffId
          case 'CreatorId' ||
            'PersonInChargeId' ||
            'StaffId' ||
            'SaleEmployeeId': {
            const filter = new AppUserFilter();
            filter.id.in = defaultListId;
            roleRepository.singleListWard(filter).then((list: AppUser[]) => {
              setAppUserDefaultList(list);
            });
            break;
          }
          // SupplierId
          case 'SupplierId': {
            const filter = new SupplierFilter();
            filter.id.in = defaultListId;
            roleRepository
              .singleListSupplier(filter)
              .then((list: Supplier[]) => {
                setSupplierDefaultList(list);
              });
            break;
          }
          // StoreTypeId
          case 'StoreTypeId': {
            const filter = new StoreTypeFilter();
            filter.id.in = defaultListId;
            roleRepository
              .singleListStoreType(filter)
              .then((list: StoreType[]) => {
                setStoreTypeDefaultList(list);
              });
            break;
          }
          // ParentStoreId, BuyerStoreId, SellerStoreId
          case 'ParenStoreId' || 'BuyerStoreId' || 'SellerStoreId': {
            const filter = new StoreFilter();
            filter.id.in = defaultListId;
            roleRepository.singleListStore(filter).then((list: Store[]) => {
              setParentStoreDefaultList(list);
            });
            break;
          }
          // StoreGroupingId
          case 'StoreGroupingId': {
            const filter = new StoreGroupingFilter();
            filter.id.in = defaultListId;
            roleRepository
              .singleListStoreGrouping(filter)
              .then((list: StoreGrouping[]) => {
                setStoreGroupingDefaultList(list);
              });
            break;
          }
          // ProductTypeId
          case 'ProductTypeId': {
            const filter = new ProductTypeFilter();
            filter.id.in = defaultListId;
            roleRepository
              .singleListProductType(filter)
              .then((list: ProductType[]) => {
                setProductTypeDefaultList(list);
              });
            break;
          }
          // BrandId
          case 'BrandId': {
            const filter = new BrandFilter();
            filter.id.in = defaultListId;
            roleRepository.singleListBrand(filter).then((list: Brand[]) => {
              setBrandDefaultList(list);
            });
            break;
          }
          // RequestStateId
          case 'RequestStateId': {
            const filter = new RequestStateFilter();
            filter.id.in = defaultListId;
            roleRepository
              .singleListBrand(filter)
              .then((list: RequestState[]) => {
                setRequestStateDefaultList(list);
              });
            break;
          }
        }
      }
    }
  }, [item, value]);

  const handleChange = React.useCallback(
    (items: DefaultOptionValue[]) => {
      if (handleList) {
        if (items.length > 0) {
          handleList(items.map(item => item.id));
        }
      }
    },
    [handleList],
  );
  const renderInput = React.useMemo(() => {
    return () => {
      if (item) {
        switch (item.name.trim()) {
          // OrganizationId
          case 'OrganizationId':
            return (
              <MultiSelect
                getList={roleRepository.singleListOrganization}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={organizationDefaultList}
              />
            );
          // RoleId
          case 'RoleId':
            return (
              <MultiSelect
                getList={roleRepository.singleListRole}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={roleDefaultList}
              />
            );
          // MenuId
          case 'MenuId':
            return (
              <MultiSelect
                getList={roleRepository.singleListMenu}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={menuDefaultList}
              />
            );
          // SexId
          case 'SexId':
            return (
              <MultiSelect
                getList={roleRepository.singleListSex}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={sexDefaultList}
              />
            );
          // CreatorId
          case 'CreatorId':
            return (
              <MultiSelect
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={appUserDefaultList}
              />
            );
          // supplierId
          case 'SupplierId':
            return (
              <MultiSelect
                getList={roleRepository.singleListSupplier}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={supplierDefaultList}
              />
            );
          // PersonInChargeId
          case 'PersonInChargeId' ||
            'SaleEmployeeId' ||
            'CreatorId' ||
            'StaffId':
            return (
              <MultiSelect
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={appUserDefaultList}
              />
            );
          // parentStoreId
          case 'ParentStoreId' || 'BuyerStoreId' || 'SellerStoreId':
            return (
              <MultiSelect
                getList={roleRepository.singleListStore}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={parentStoreDefaultList}
              />
            );
          // storeTypeId
          case 'StoreTypeId':
            return (
              <MultiSelect
                getList={roleRepository.singleListStoreType}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={storeTypeDefaultList}
              />
            );
          // storeGroupingId
          case 'StoreGroupingId':
            return (
              <MultiSelect
                getList={roleRepository.singleListStoreGrouping}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={storeGroupingDefaultList}
              />
            );
          // ProductTypeId
          case 'ProductTypeId':
            return (
              <MultiSelect
                getList={roleRepository.singleListProductType}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={productTypeDefaultList}
              />
            );
          // productTypeId
          case 'BrandId':
            return (
              <MultiSelect
                getList={roleRepository.singleListBrand}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={brandDefaultList}
              />
            );
          // requestStateId
          case 'RequestStateId':
            return (
              <MultiSelect
                getList={roleRepository.singleListRequestState}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={requestStateDefaultList}
              />
            );
          // ParentStoreId, BuyerStoreId, SellerStoreId
          case 'ParenStoreId' || 'BuyerStoreId' || 'SellerStoreId':
            return (
              <MultiSelect
                getList={roleRepository.singleListStore}
                placeholder={translate('fields.placeholder.idType')}
                allowClear={false}
                onChange={handleChange}
                defaultOptions={parentStoreDefaultList}
              />
            );
        }
      }
    };
  }, [appUserDefaultList, brandDefaultList, handleChange, item, menuDefaultList, organizationDefaultList, parentStoreDefaultList, productTypeDefaultList, requestStateDefaultList, roleDefaultList, sexDefaultList, storeGroupingDefaultList, storeTypeDefaultList, supplierDefaultList, translate]);

  return (
    <div className="field-input">
      {item && (
        <Row>
          <Col lg={24}>
            <FormItem className="input-id">{renderInput()}</FormItem>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default IdFieldInput;
