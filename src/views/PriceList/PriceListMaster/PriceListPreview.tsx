import { PriceList } from 'models/priceList/PriceList';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Descriptions, Spin, Tabs, Card } from 'antd';
import { formatDateTime } from 'core/helpers/date-time';
import { useGlobal } from 'reactn';
import { AppUser } from 'models/AppUser';
import ChatBox from 'components/ChatBox/ChatBox';
import { PostFilter } from 'models/PostFilter';
import PriceListStoreTypeMapping from '../PriceListDetail/PriceListMappingTabs/PriceListStoreMappingTab/PriceListStoreTypeMapping';
import PriceListStoreGroupingMapping from '../PriceListDetail/PriceListMappingTabs/PriceListStoreMappingTab/PriceListStoreGroupingMapping';
import PriceListStoreMappingTable from '../PriceListDetail/PriceListMappingTabs/PriceListStoreMappingTab/PriceListStoreMappingTable';
import PriceListItemMappingTable from '../PriceListDetail/PriceListMappingTabs/PriceListItemMappingTab/PriceListItemMappingTable';
import { priceListRepository } from '../PriceListRepository';

const { TabPane } = Tabs;

export interface PreviewPriceListProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading?: boolean;
}

export default function PreviewPriceList(props: PreviewPriceListProps) {
  const { model, setModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  const [user] = useGlobal<AppUser>('user');
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={model.name}
      code={model.code}
      statusId={model.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('priceLists.code')}>
            {model?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('priceLists.organization')}>
            {model.organization?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('priceLists.name')}>
            {model?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('priceLists.priceListType')}>
            {model?.priceListType?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('priceLists.startDate')}>
            {model.startDate ? formatDateTime(model.startDate) : ''}
          </Descriptions.Item>
          <Descriptions.Item label={translate('priceLists.endDate')}>
            {model.endDate ? formatDateTime(model.endDate) : ''}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          column={1}
          title={translate('priceLists.priceListTypeAndItemMapping')}
        >
          <Card className="mt-3">
            <Tabs defaultActiveKey="1" className="mr-3 tab">
              <TabPane
                key="storeMappings"
                tab={translate('priceLists.tabs.storeMappings.title')}
              >
                {model.priceListTypeId &&
                  model.priceListTypeId.toString() === '1' && (
                    <>Tất cả đại lý thuộc đơn vị</>
                  )}
                {/* storeType Mapping */}
                {model.priceListTypeId &&
                  model.priceListTypeId.toString() === '2' && (
                    <PriceListStoreTypeMapping
                      model={model}
                      setModel={setModel}
                      isPreview={true}
                    />
                  )}
                {/* storeGrouping Mapping */}
                {model.priceListTypeId &&
                  model.priceListTypeId.toString() === '3' && (
                    <PriceListStoreGroupingMapping
                      model={model}
                      setModel={setModel}
                      isPreview={true}
                    />
                  )}
                {/* store Mapping */}
                {model.priceListTypeId &&
                  model.priceListTypeId.toString() === '4' && (
                    <PriceListStoreMappingTable
                      model={model}
                      setModel={setModel}
                      isPreview={true}
                    />
                  )}
              </TabPane>
              <TabPane
                key="itemMappings"
                tab={translate('priceLists.tabs.itemMappings.title')}
              >
                <PriceListItemMappingTable
                  model={model}
                  setModel={setModel}
                  isPreview={true}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Descriptions>
        <Card>
          <ChatBox
            userInfo={user as AppUser || AppUser}
            discussionId={model.rowId}
            getMessages={priceListRepository.listPost}
            classFilter={PostFilter}
            postMessage={priceListRepository.createPost}
            countMessages={priceListRepository.countPost}
            deleteMessage={priceListRepository.deletePost}
            attachFile={priceListRepository.saveFile}
            suggestList={priceListRepository.singleListAppUser}
          />
        </Card>
      </Spin>
    </MasterPreview>
  );
}

PreviewPriceList.defaultProp = {
  previewVisible: false,
  model: {},
};
