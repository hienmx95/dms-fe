import Form from 'antd/lib/form';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { formService } from 'core/services/FormService';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PermissionContent } from 'models/PermissionContents';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
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
import { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { RequestStateFilter } from 'models/RequestStateFilter';
import { RequestState } from 'models/RequestState';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { EnumList } from 'models/EnumList';
import { EnumListFilter } from 'models/EnumListFilter';

const { Item: FormItem } = Form;

export interface IdFilterInputProps {
  value?: string | number | Moment | boolean | undefined;
  fieldName?: string;
  index?: number;
  contents?: PermissionContent[];
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function IdFieldInput(props: IdFilterInputProps) {
  const [translate] = useTranslation();
  const { value, fieldName, index, contents, setContents, disabled } = props;

  /* filter */
  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>(
    new RoleFilter(),
  );
  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );
  const [sexFilter, setSexFilter] = React.useState<SexFilter>(new SexFilter());
  const [userFilter, setUserFilter] = React.useState<EnumListFilter>(
    new EnumListFilter(),
  );
  const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
    new SupplierFilter(),
  );
  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );
  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );
  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());
  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());
  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());
  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );
  const [requestStateFilter, setRequestStateFilter] = React.useState<
    RequestStateFilter
  >(new RequestStateFilter());
  const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<
    ERouteTypeFilter
  >(new ERouteTypeFilter());
  const [roleDefaultList, setRoleDefaultList] = React.useState<Role[]>([]);
  const [menuDefaultList, setMenuDefaultList] = React.useState<Menu[]>([]);
  const [sexDefaultList, setSexDefaultList] = React.useState<Sex[]>([]);
  const [userDefaultList, setUserDefaultList] = React.useState<EnumList[]>([]);
  const [appUserDefaultList, setAppUserDefaultList] = React.useState<AppUser[]>(
    [],
  );
  const [supplierDefaultList, setSupplierDefaultList] = React.useState<
    Supplier[]
  >([]);
  const [storeDefaultList, setStoreDefaultList] = React.useState<Store[]>([]);
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
  const [eRouteTypeDefaultList, setERouteTypeDefaultList] = React.useState<
    ERouteType[]
  >([]);

  const handleChange = React.useCallback(
    value => {
      if (contents) {
        contents[index] = { ...contents[index], value };
        setContents([...contents]);
      }
    },
    [contents, index, setContents],
  );

  React.useEffect(() => {
    if (value) {
      // convert value from string to array id
      switch (fieldName.trim()) {
        // UserId
        case 'UserId': {
          roleRepository
            .singleListCurrentUser({ ...userFilter, id: { equal: value } })
            .then((list: EnumList[]) => {
              setUserDefaultList(list);
            });
          break;
        }
        // RoleId
        case 'RoleId': {
          roleRepository
            .singleListRole({ ...roleFilter, id: { equal: value } })
            .then((list: Role[]) => {
              setRoleDefaultList(list);
            });
          break;
        }
        // MenuId
        case 'MenuId': {
          roleRepository
            .singleListMenu({ ...menuFilter, id: { equal: value } })
            .then((list: Menu[]) => {
              setMenuDefaultList(list);
            });
          break;
        }
        // SexId
        case 'SexId': {
          roleRepository
            .singleListSex({ ...sexFilter, id: { equal: value } })
            .then((list: Sex[]) => {
              setSexDefaultList(list);
            });
          break;
        }
        // AppUserId
        case 'AppUserId': {
          roleRepository
            .singleListAppUser({ ...appUserFilter, id: { equal: value } })
            .then((list: AppUser[]) => {
              setAppUserDefaultList(list);
            });
          break;
        }
        // CreatorId, PersonInChargeId, StaffId
        case 'CreatorId': {
          roleRepository
            .singleListAppUser({ ...appUserFilter, id: { equal: value } })
            .then((list: AppUser[]) => {
              setAppUserDefaultList(list);
            });
          break;
        }
        // PersonInChargeId
        case 'PersonInChargeId': {
          roleRepository
            .singleListAppUser({ ...appUserFilter, id: { equal: value } })
            .then((list: AppUser[]) => {
              setAppUserDefaultList(list);
            });
          break;
        }
        // StaffId
        case 'StaffId': {
          roleRepository
            .singleListAppUser({ ...appUserFilter, id: { equal: value } })
            .then((list: AppUser[]) => {
              setAppUserDefaultList(list);
            });
          break;
        }
        // SaleEmployeeId
        case 'SaleEmployeeId': {
          roleRepository
            .singleListAppUser({ ...appUserFilter, id: { equal: value } })
            .then((list: AppUser[]) => {
              setAppUserDefaultList(list);
            });
          break;
        }
        // SupplierId
        case 'SupplierId': {
          roleRepository
            .singleListSupplier({ ...supplierFilter, id: { equal: value } })
            .then((list: Supplier[]) => {
              setSupplierDefaultList(list);
            });
          break;
        }
        // StoreTypeId
        case 'StoreTypeId': {
          roleRepository
            .singleListStoreType({ ...storeTypeFilter, id: { equal: value } })
            .then((list: StoreType[]) => {
              setStoreTypeDefaultList(list);
            });
          break;
        }
        // ParentStoreId
        case 'ParenStoreId': {
          roleRepository
            .singleListStore({ ...storeFilter, id: { equal: value } })
            .then((list: Store[]) => {
              setStoreDefaultList(list);
            });
          break;
        }
        // BuyerStoreId
        case 'BuyerStoreId': {
          roleRepository
            .singleListStore({ ...storeFilter, id: { equal: value } })
            .then((list: Store[]) => {
              setStoreDefaultList(list);
            });
          break;
        }
        // SellerStoreId
        case 'SellerStoreId': {
          roleRepository
            .singleListStore({ ...storeFilter, id: { equal: value } })
            .then((list: Store[]) => {
              setStoreDefaultList(list);
            });
          break;
        }
        // StoreId
        case 'StoreId': {
          roleRepository
            .singleListStore({ ...storeFilter, id: { equal: value } })
            .then((list: Store[]) => {
              setStoreDefaultList(list);
            });
          break;
        }
        // StoreGroupingId
        case 'StoreGroupingId': {
          roleRepository
            .singleListStoreGrouping({
              ...storeGroupingFilter,
              id: { equal: value },
            })
            .then((list: StoreGrouping[]) => {
              setStoreGroupingDefaultList(list);
            });
          break;
        }
        // ProductTypeId
        case 'ProductTypeId': {
          roleRepository
            .singleListProductType({
              ...productTypeFilter,
              id: { equal: value },
            })
            .then((list: ProductType[]) => {
              setProductTypeDefaultList(list);
            });
          break;
        }
        // BrandId
        case 'BrandId': {
          roleRepository
            .singleListBrand({ ...brandFilter, id: { equal: value } })
            .then((list: Brand[]) => {
              setBrandDefaultList(list);
            });
          break;
        }
        // RequestStateId
        case 'RequestStateId': {
          roleRepository
            .singleListRequestState({
              ...requestStateFilter,
              id: { equal: value },
            })
            .then((list: RequestState[]) => {
              setRequestStateDefaultList(list);
            });
          break;
        }
        // ERouteTypeId
        case 'ERouteTypeId': {
          roleRepository
            .singleListErouteType({
              ...eRouteTypeFilter,
              id: { equal: value },
            })
            .then((list: ERouteType[]) => {
              setERouteTypeDefaultList(list);
            });
          break;
        }
      }
    }
  }, [
    appUserFilter,
    brandFilter,
    eRouteTypeFilter,
    fieldName,
    menuFilter,
    organizationFilter,
    productGroupingFilter,
    productTypeFilter,
    requestStateFilter,
    roleFilter,
    sexFilter,
    storeFilter,
    storeGroupingFilter,
    storeTypeFilter,
    supplierFilter,
    userFilter,
    value,
  ]);

  const renderInput = React.useMemo(() => {
    return () => {
      if (fieldName) {
        switch (fieldName.trim()) {
          // UserId
          case 'UserId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListCurrentUser}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={userFilter}
                setModelFilter={setUserFilter}
                searchField={nameof(userFilter.name)}
                searchType={nameof(userFilter.name.contain)}
                list={userDefaultList}
                disabled={disabled}
              />
            );
          // OrganizationId, tree select dropdown
          case 'OrganizationId':
            return (
              <TreeSelectDropdown
                defaultValue={value ? +value : null}
                value={+value ? +value : null}
                mode="single"
                onChange={handleChange}
                modelFilter={organizationFilter}
                setModelFilter={setOrganizationFilter}
                getList={roleRepository.singleListOrganization}
                searchField={nameof(organizationFilter.name)}
                placeholder={translate('fields.placeholder.idType')}
                disabled={disabled}
              />
            );
          // RoleId
          case 'RoleId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListRole}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={roleFilter}
                setModelFilter={setRoleFilter}
                searchField={nameof(roleFilter.name)}
                searchType={nameof(roleFilter.name.contain)}
                list={roleDefaultList}
                disabled={disabled}
              />
            );
          // MenuId
          case 'MenuId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListMenu}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={menuFilter}
                setModelFilter={setMenuFilter}
                searchField={nameof(sexFilter.name)}
                searchType={nameof(sexFilter.name.contain)}
                list={menuDefaultList}
                disabled={disabled}
              />
            );
          // SexId
          case 'SexId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListSex}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={sexFilter}
                setModelFilter={setSexFilter}
                searchField={nameof(menuFilter.name)}
                searchType={nameof(menuFilter.name.contain)}
                list={sexDefaultList}
                disabled={disabled}
              />
            );
          // supplierId
          case 'SupplierId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListSupplier}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={supplierFilter}
                setModelFilter={setSupplierFilter}
                searchField={nameof(supplierFilter.name)}
                searchType={nameof(supplierFilter.name.contain)}
                list={supplierDefaultList}
                disabled={disabled}
              />
            );
          // PersonInChargeId
          case 'PersonInChargeId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={appUserFilter}
                setModelFilter={setAppUserFilter}
                searchField={nameof(appUserFilter.displayName)}
                searchType={nameof(appUserFilter.displayName.contain)}
                list={appUserDefaultList}
                disabled={disabled}
              />
            );
          // AppUserId
          case 'AppUserId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={appUserFilter}
                setModelFilter={setAppUserFilter}
                searchField={nameof(appUserFilter.displayName)}
                searchType={nameof(appUserFilter.displayName.contain)}
                list={appUserDefaultList}
                disabled={disabled}
              />
            );
          // SaleEmployeeId
          case 'SaleEmployeeId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={appUserFilter}
                setModelFilter={setAppUserFilter}
                searchField={nameof(appUserFilter.displayName)}
                searchType={nameof(appUserFilter.displayName.contain)}
                list={appUserDefaultList}
                disabled={disabled}
              />
            );
          // CreatorId
          case 'CreatorId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={appUserFilter}
                setModelFilter={setAppUserFilter}
                searchField={nameof(appUserFilter.displayName)}
                searchType={nameof(appUserFilter.displayName.contain)}
                list={appUserDefaultList}
                disabled={disabled}
              />
            );
          // StaffId
          case 'StaffId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListAppUser}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={appUserFilter}
                setModelFilter={setAppUserFilter}
                searchField={nameof(appUserFilter.displayName)}
                searchType={nameof(appUserFilter.displayName.contain)}
                list={appUserDefaultList}
                disabled={disabled}
              />
            );
          // parentStoreId, tree select dropdown
          case 'ParentStoreId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListStore}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={storeFilter}
                setModelFilter={setStoreFilter}
                searchField={nameof(storeFilter.name)}
                searchType={nameof(storeFilter.name.contain)}
                list={storeDefaultList}
                disabled={disabled}
              />
            );
          // buyerStoreId, tree select dropdown
          case 'BuyerStoreId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListStore}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={storeFilter}
                setModelFilter={setStoreFilter}
                searchField={nameof(storeFilter.name)}
                searchType={nameof(storeFilter.name.contain)}
                list={storeDefaultList}
                disabled={disabled}
              />
            );
          // sellerStoreId, tree select dropdown
          case 'SellerStoreId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListStore}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={storeFilter}
                setModelFilter={setStoreFilter}
                searchField={nameof(storeFilter.name)}
                searchType={nameof(storeFilter.name.contain)}
                list={storeDefaultList}
                disabled={disabled}
              />
            );
          // StoreId
          case 'StoreId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListStore}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={storeFilter}
                setModelFilter={setStoreFilter}
                searchField={nameof(storeFilter.name)}
                searchType={nameof(storeFilter.name.contain)}
                list={storeDefaultList}
                disabled={disabled}
              />
            );
          // storeTypeId
          case 'StoreTypeId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListStoreType}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={storeTypeFilter}
                setModelFilter={setStoreTypeFilter}
                searchField={nameof(storeTypeFilter.name)}
                searchType={nameof(storeTypeFilter.name.contain)}
                list={storeTypeDefaultList}
                disabled={disabled}
              />
            );
          // storeGroupingId
          case 'StoreGroupingId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListStoreGrouping}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={storeGroupingFilter}
                setModelFilter={setStoreGroupingFilter}
                searchField={nameof(storeGroupingFilter.name)}
                searchType={nameof(storeGroupingFilter.name.contain)}
                list={storeGroupingDefaultList}
                disabled={disabled}
              />
            );
          // ProductTypeId
          case 'ProductTypeId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListProductType}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={productTypeFilter}
                setModelFilter={setProductTypeFilter}
                searchField={nameof(productTypeFilter.name)}
                searchType={nameof(productTypeFilter.name.contain)}
                list={productTypeDefaultList}
                disabled={disabled}
              />
            );
          // ProductGroupingId, tree select dropdown
          case 'ProductGroupingId':
            return (
              <TreeSelectDropdown
                defaultValue={value ? +value : null}
                value={+value ? +value : null}
                mode="single"
                onChange={handleChange}
                modelFilter={productGroupingFilter}
                setModelFilter={setProductGroupingFilter}
                getList={roleRepository.singleListProductGrouping}
                searchField={nameof(productGroupingFilter.name)}
                placeholder={translate('fields.placeholder.idType')}
                disabled={disabled}
              />
            );
          // BrandId
          case 'BrandId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListBrand}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={brandFilter}
                setModelFilter={setBrandFilter}
                searchField={nameof(brandFilter.name)}
                searchType={nameof(brandFilter.name.contain)}
                list={brandDefaultList}
                disabled={disabled}
              />
            );
          // requestStateId
          case 'RequestStateId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListRequestState}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={requestStateFilter}
                setModelFilter={setRequestStateFilter}
                searchField={nameof(requestStateFilter.name)}
                searchType={nameof(requestStateFilter.name.contain)}
                list={requestStateDefaultList}
                disabled={disabled}
              />
            );
          // eRouteTypeId
          case 'ERouteTypeId':
            return (
              <SelectAutoComplete
                value={+value}
                getList={roleRepository.singleListErouteType}
                placeholder={translate('fields.placeholder.idType')}
                onChange={handleChange}
                modelFilter={eRouteTypeFilter}
                setModelFilter={setERouteTypeFilter}
                searchField={nameof(eRouteTypeFilter.name)}
                searchType={nameof(eRouteTypeFilter.name.contain)}
                list={eRouteTypeDefaultList}
                disabled={disabled}
              />
            );
        }
      }
    };
  }, [
    appUserDefaultList,
    appUserFilter,
    brandDefaultList,
    brandFilter,
    disabled,
    eRouteTypeDefaultList,
    eRouteTypeFilter,
    fieldName,
    handleChange,
    menuDefaultList,
    menuFilter,
    organizationFilter,
    productGroupingFilter,
    productTypeDefaultList,
    productTypeFilter,
    requestStateDefaultList,
    requestStateFilter,
    roleDefaultList,
    roleFilter,
    sexDefaultList,
    sexFilter,
    storeDefaultList,
    storeFilter,
    storeGroupingDefaultList,
    storeGroupingFilter,
    storeTypeDefaultList,
    storeTypeFilter,
    supplierDefaultList,
    supplierFilter,
    translate,
    userDefaultList,
    userFilter,
    value,
  ]);

  return (
    <FormItem
      validateStatus={formService.getValidationStatus<any>(
        contents[index].errors,
        nameof(contents[index].value),
      )}
      help={contents[index].errors?.value}
    >
      {renderInput()}
    </FormItem>
  );
}

export default IdFieldInput;
