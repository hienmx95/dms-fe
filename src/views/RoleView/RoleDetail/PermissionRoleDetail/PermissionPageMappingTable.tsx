import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import { Page } from 'models/Page';
import { PermissionPageMapping } from 'models/PermissionPageMapping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import '.././RoleDetail.scss';
export interface PermissionPageMappingTableProps {
  list?: PermissionPageMapping[];
  rowSelection?: TableRowSelection<Page>;
}
function PermissionPageMappingTable(props: PermissionPageMappingTableProps) {
  const { list, rowSelection } = props;
  const [translate] = useTranslation();
  const columns: ColumnProps<Page>[] = React.useMemo(() => {
    return [
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        title: translate('pages.name'),
        ellipsis: true,
        render(...[, page]) {
          return page?.name;
        },
      },
      {
        key: nameof(list[0].path),
        dataIndex: nameof(list[0].path),
        title: translate('pages.path'),
        ellipsis: true,
        render(...[, page]) {
          return page?.path;
        },
      },
    ];
  }, [list, translate]);
  return (
    <>
      <div>
        <Table
          tableLayout="fixed"
          bordered={false}
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
          rowKey={nameof(list[0].id)}
          pagination={false}
          className="page-table"
          scroll={{ y: 480 }}
        />
      </div>
    </>
  );
}

export default PermissionPageMappingTable;
