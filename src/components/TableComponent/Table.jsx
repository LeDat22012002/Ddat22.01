import { Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { useState } from 'react';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], handleDeleteMany } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys);
    };
    return (
        <Loading isLoading={isLoading}>
            {rowSelectedKeys.length > 0 && (
                <div
                    style={{
                        backgroundColor: '#1d1ddd',
                        color: '#fff',
                        fontWeight: '500',
                        padding: '10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                    onClick={handleDeleteAll}
                >
                    Xóa tất cả
                </div>
            )}

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                {...props}
            />
        </Loading>
    );
};

export default TableComponent;
