import { Col, Row } from 'antd';
import { crudService } from 'core/services';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeOrganizationMapping } from 'models/PromotionCodeOrganizationMapping';
import { PromotionCodeOrganizationMappingFilter } from 'models/PromotionCodeOrganizationMappingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { promotionCodeRepository } from 'views/PromotionCodeView/PromotionCodeRepository';
import OrganizationTree from './OrganizationTree';



export interface PromotionTypeOrganizationMappingProps {
  model: PromotionCode;
  setModel: Dispatch<SetStateAction<PromotionCode>>;
  isPreview?: boolean;
  listDefault?: PromotionCodeOrganizationMapping[];
  disabled?: boolean;
}

export default function PromotionTypeOrganizationMapping(
  props: PromotionTypeOrganizationMappingProps,
) {
  const { model, setModel, listDefault, isPreview, disabled } = props;


  const defaultPromotionCodeOrganizationMappingList: PromotionCodeOrganizationMapping[] = crudService.useDefaultList<
    PromotionCodeOrganizationMapping
  >(model.promotionCodeOrganizationMappings);

  const [selectedItems, setSelectedItems] = React.useState<
    Organization[]
  >([]);

  const [
    promotionCodeOrganizationMappingFilter,
    setPromotionCodeOrganizationMappingFilter,
  ] = React.useState<PromotionCodeOrganizationMappingFilter>(
    new PromotionCodeOrganizationMappingFilter(),
  );

  React.useEffect(() => {

    if (model?.promotionCodeOrganizationMappings && model?.promotionCodeOrganizationMappings?.length > 0) {
      const selectedList = [];
      model?.promotionCodeOrganizationMappings.forEach((item) => {
        selectedList.push(item?.organization);
      });
      setSelectedItems(selectedList);
    } else if (model?.organizationId) {
      const promotionCodeOrganizationMappings = [];
      const orgFilter = new OrganizationFilter();
      orgFilter.path.startWith = model?.organization?.path;
      promotionCodeRepository.singleListOrganization3(orgFilter).then(res => {
        setSelectedItems(res);
        res.forEach(item => {
          promotionCodeOrganizationMappings.push({
            organization: item,
            organizationId: item.id,
          });
        });
        setModel({
          ...model,
          promotionCodeOrganizationMappings,
        });
      });
    }


  }, [model, setModel]);


  const handleChangeTreePopup = React.useCallback((items: Organization[]) => {
    const promotionCodeOrganizationMappings = [];
    setSelectedItems(items);
    if (items && items.length > 0) {
      items.forEach(item => {
        promotionCodeOrganizationMappings.push({
          organization: item,
          organizationId: item.id,
        });
      });
    }
    setModel({
      ...model,
      promotionCodeOrganizationMappings,
    });
  }, [model, setModel]);


  return (
    <Row>
      <Col span={6}>
        <OrganizationTree
          onChange={handleChangeTreePopup}
          list={defaultPromotionCodeOrganizationMappingList}
          listDefault={listDefault}
          selectedItems={selectedItems}
          modelFilter={promotionCodeOrganizationMappingFilter}
          setModelFilter={setPromotionCodeOrganizationMappingFilter}
          isPreview={isPreview}
          disabled={disabled}
        />
      </Col>
    </Row>
  );
}
