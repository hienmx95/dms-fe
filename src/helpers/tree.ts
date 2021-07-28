export interface ITreeItem {
  parentId?: any;

  children?: ITreeItem[];

  [key: string]: any;
}

export const buildTree = (flatList: ITreeItem[]): ITreeItem[] => {
  const map: { [key: string]: ITreeItem } | { [key: number]: ITreeItem } = {};
  flatList.forEach((flatItem: ITreeItem) => {
    map[flatItem.id] = flatItem;

    if (!flatItem.children) {
      flatItem.children = [];
    }
  });
  flatList.forEach((flatItem: ITreeItem) => {
    if (flatItem.parentId) {
      if (map[flatItem.parentId]) {
        map[flatItem.parentId].children = [
          ...map[flatItem.parentId].children,
          flatItem,
        ];
      }
    }
  });

  return flatList.filter((flatItem: ITreeItem) => !flatItem.parentId);
};

export const buildTree2 = (flatList: ITreeItem[]): ITreeItem[] => {
  const map: { [key: string]: ITreeItem } | { [key: number]: ITreeItem } = {};
  flatList.forEach((flatItem: ITreeItem) => {
    map[flatItem.id] = flatItem;
    if (!flatItem.children) {
      flatItem.children = [];
    }

    if (!flatItem.disableCheckbox) {
      flatItem.disableCheckbox = true;
    }
    if (!flatItem.disabled) {
      flatItem.disabled = true;
    }
  });
  flatList.forEach((flatItem: ITreeItem) => {
    if (flatItem.parentId) {
      if (map[flatItem.parentId]) {
        map[flatItem.parentId].children = [
          ...map[flatItem.parentId].children,
          flatItem,
        ];
      }
    }
  });
  return flatList.filter((flatItem: ITreeItem) => !flatItem.parentId);
};
export function applyTreeNavigation(
  tree: ITreeItem[],
  parent: ITreeItem = null,
) {
  tree.forEach((item: ITreeItem, index: number) => {
    item.parent = parent;

    if (index > 0) {
      item.previousSibLing = tree[index - 1];
    }

    if (index < tree.length - 1) {
      item.nextSibling = tree[index + 1];
    }

    if (item.children && item.children.length > 0) {
      applyTreeNavigation(item.children, item);
    }
  });
  return tree;
}
