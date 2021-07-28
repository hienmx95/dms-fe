import React, { Dispatch, SetStateAction } from 'react';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';

import ContentModal, { ContentModalProps } from '../ContentModal/ContentModal';
import { Organization } from 'models/Organization';

export interface AppUserModalProps extends ContentModalProps<AppUser> {
  title: string;

  selectedList: AppUser[];

  setSelectedList: Dispatch<SetStateAction<AppUser[]>>;

  list: AppUser[];

  loading: boolean;

  total: number;

  onSave?: (selectedList: AppUser[], currentItem: Organization) => void;

  isSave?: boolean;

  currentItem: Organization;

  getList?: (appUserFilter?: AppUserFilter) => Promise<AppUser[]>;

  count?: (appUserFilter?: AppUserFilter) => Promise<number>;

  onClose?: (currentItem) => void;
}

function AppUserModal(props: AppUserModalProps) {

  const {
    list,
    selectedList,
    setSelectedList,
    total,
    onSave,
    getList,
    onClose,
    ...restProps
  } = props;

  return (
    <ContentModal
      {...restProps}
      key={list[0]?.id}
      selectedList={selectedList}
      setSelectedList={setSelectedList}
      list={list}
      onSave={onSave}
      isSave={props.isSave}
      total={total}
      getList={getList}
      onClose={onClose}
    >
    </ContentModal>
  );
}

export default AppUserModal;
