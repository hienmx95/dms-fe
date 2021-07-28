import React from 'react';
import nameof from 'ts-nameof.macro';
import '.././RoleDetail.scss';
import Table, { TableRowSelection, ColumnProps } from 'antd/lib/table';
import { PermissionActionMapping } from 'models/PermissionActionMapping';
import { Action } from 'models/Action';
import { useTranslation } from 'react-i18next';
export interface PermissionPageMappingTableProps {
  list?: PermissionActionMapping[];
  rowSelection?: TableRowSelection<Action>;
}
function PermissionActionMappingTable(props: PermissionPageMappingTableProps) {
  const [translate] = useTranslation();
  const { list, rowSelection } = props;
  const columns: ColumnProps<Action>[] = React.useMemo(() => {
    return [
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        title: translate('actions.name'),
        ellipsis: true,
        render(...[, action]) {
          return action?.name;
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

export default PermissionActionMappingTable;
