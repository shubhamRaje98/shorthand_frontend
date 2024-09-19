import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Select, Typography, Space, Input, InputNumber, Button, Checkbox, message, Form } from 'antd';
import { SearchOutlined, DownloadOutlined, EditOutlined, SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Title } = Typography;

// Define columns that should always use dropdown filters
const DROPDOWN_FILTER_COLUMNS = ['batchNo', 'department', 'year', 'semester']; // Add more column names as needed

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const SuperAdminDashboard = () => {
    const [form] = Form.useForm();
    const [tableNames, setTableNames] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [changedRows, setChangedRows] = useState({});

    useEffect(() => {
        fetchTableNames();
    }, []);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...tableData];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setTableData(newData);
                setEditingKey('');
                // Store changed row
                setChangedRows(prev => ({...prev, [key]: {...item, ...row}}));
                message.success('Row updated locally. Click Submit Changes to save to the backend.');
            } else {
                newData.push(row);
                setTableData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const submitChanges = async () => {
        try {
            const response = await axios.post('https://shorthandonlineexam.in/update-table-data', {
                tableName: selectedTable,
                updatedRows: Object.values(changedRows)
            }, {
                withCredentials: true
            });
            if (response.data.success) {
                message.success('Changes submitted successfully to the backend');
                setChangedRows({});
            } else {
                message.error('Failed to submit changes to the backend');
            }
        } catch (error) {
            console.error('Error submitting changes:', error);
            message.error('Error submitting changes to the backend');
        }
    };

    const fetchTableNames = async () => {
        try {
            const response = await axios.get('https://shorthandonlineexam.in/fetch-table-names', {
                withCredentials: true
            });
            setTableNames(response.data);
        } catch (error) {
            console.error('Error fetching table names:', error);
        }
    };

    const fetchTableData = async (tableName) => {
        try {
            const response = await axios.post('https://shorthandonlineexam.in/fetch-table-data', {
                tableName
            }, {
                withCredentials: true
            });
            const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
            setTableData(dataWithKeys);
            setFilteredData(dataWithKeys);
            if (dataWithKeys.length > 0) {
                const tableColumns = Object.keys(dataWithKeys[0])
                    .filter(key => !(tableName === 'students' && key === 'base64')) // Ignore base64 column for students table
                    .map(key => {
                        if (key === 'key') return null;
                        const columnFilters = getColumnFilters(dataWithKeys, key);
                        const useDropdownFilter = DROPDOWN_FILTER_COLUMNS.includes(key) || columnFilters.length < 15;
                        
                        return {
                            title: key,
                            dataIndex: key,
                            key: key,
                            filters: columnFilters,
                            onFilter: (value, record) => {
                                const cellValue = record[key];
                                if (cellValue == null) return false;
                                return cellValue.toString().toLowerCase() === value.toLowerCase();
                            },
                            filterDropdown: useDropdownFilter
                                ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                                    <div style={{ padding: 8 }}>
                                        {columnFilters.map(filter => (
                                            <div key={filter.value}>
                                                <Checkbox
                                                    checked={selectedKeys.includes(filter.value)}
                                                    onChange={(e) => {
                                                        const newSelectedKeys = e.target.checked
                                                            ? [...selectedKeys, filter.value]
                                                            : selectedKeys.filter(k => k !== filter.value);
                                                        setSelectedKeys(newSelectedKeys);
                                                    }}
                                                >
                                                    {filter.text}
                                                </Checkbox>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: 8 }}>
                                            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90, marginRight: 8 }}>
                                                OK
                                            </Button>
                                            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                                                Reset
                                            </Button>
                                        </div>
                                    </div>
                                )
                                : ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                                    <div style={{ padding: 8 }}>
                                        <Input
                                            placeholder={`Search ${key}`}
                                            value={selectedKeys[0]}
                                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                            onPressEnter={() => confirm()}
                                            style={{ width: 188, marginBottom: 8, display: 'block' }}
                                        />
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={() => confirm()}
                                                icon={<SearchOutlined />}
                                                size="small"
                                                style={{ width: 90 }}
                                            >
                                                Search
                                            </Button>
                                            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                                                Reset
                                            </Button>
                                        </Space>
                                    </div>
                                ),
                            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
                            editable: true,
                        };
                    }).filter(Boolean);

                setColumns(tableColumns);
            }
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    const getColumnFilters = (data, key) => {
        const uniqueValues = [...new Set(data.map(item => item[key]))];
        return uniqueValues
            .filter(value => value != null)
            .map(value => ({ text: value.toString(), value: value.toString() }));
    };

    const handleTableSelect = (value) => {
        setSelectedTable(value);
        fetchTableData(value);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
        message.success('Excel file downloaded successfully!');
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const actionColumn = {
        title: 'Action',
        key: 'action',
        render: (_, record) => {
            const editable = isEditing(record);
            return (
                <span>
                    {editable ? (
                        <>
                            <Button 
                                onClick={() => save(record.key)} 
                                icon={<SaveOutlined />} 
                                style={{ marginRight: 8 }}
                            >
                                Save
                            </Button>
                            <Button onClick={() => cancel()} icon={<CloseOutlined />}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button 
                            disabled={editingKey !== ''} 
                            onClick={() => edit(record)} 
                            icon={<EditOutlined />}
                        >
                            Edit
                        </Button>
                    )}
                </span>
            );
        },
    };

    const columnsWithAction = [...mergedColumns, actionColumn];

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                <Title level={2}>Super Admin Dashboard</Title>
                <Space>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a table"
                        onChange={handleTableSelect}
                    >
                        {tableNames.map(name => (
                            <Option key={name} value={name}>{name}</Option>
                        ))}
                    </Select>
                    {selectedTable && (
                        <>
                            <Button 
                                type="primary" 
                                icon={<DownloadOutlined />} 
                                onClick={handleDownloadExcel}
                            >
                                Download Excel
                            </Button>
                            <Button 
                                type="primary" 
                                icon={<UploadOutlined />} 
                                onClick={submitChanges}
                                disabled={Object.keys(changedRows).length === 0}
                            >
                                Submit Changes
                            </Button>
                        </>
                    )}
                </Space>
                {selectedTable && (
                    <Form form={form} component={false}>
                        <Table 
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            columns={columnsWithAction}
                            dataSource={tableData} 
                            scroll={{ x: true }} 
                            pagination={{ pageSize: 10 }}
                            onChange={(pagination, filters, sorter, extra) => {
                                setFilteredData(extra.currentDataSource);
                            }}
                        />
                    </Form>
                )}
            </Space>
        </div>
    );
};

export default SuperAdminDashboard;