/*
 * @Description: 组织管理-表格列表
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-02 13:54:14
 * @LastEditors: Cyan
 * @LastEditTime: 2022-12-01 18:25:59
 */
// 引入第三方库
import { useRequest } from 'ahooks';
import type { FC } from 'react';
import { useState, useRef } from 'react';
import { useIntl, useModel } from '@umijs/max'
import { ProTable, TableDropdown } from '@ant-design/pro-components' // antd 高级组件
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-components'
import { ClockCircleOutlined, EditOutlined, DeleteOutlined, DownOutlined, ClusterOutlined, createFromIconfontCN } from '@ant-design/icons' // antd 图标库
import { Tag, Space, Button, Modal, message } from 'antd' // antd 组件库
import moment from 'moment'

// 引入业务组件
import { getUserList } from '@/services/system/user-management' // 用户管理接口
import { getOrganizationList, delOrganization } from '@/services/administrative/organization' // 组织管理接口
import { columnScrollX, formatResult } from '@/utils'
import type { PageResModel, PaginationProps } from '@/global/interface'
import FormTemplate from './FormTemplate'  // 表单组件
import { ORG_TYPE_TAGS } from '../utils/enum'
import type { TableSearchProps } from '../utils/interface'

const TableTemplate: FC = () => {
	const { formatMessage } = useIntl();
	// 初始化状态
	const { initialState } = useModel('@@initialState');
	// 使用 iconfont.cn 资源
	const IconFont = createFromIconfontCN({
		scriptUrl: process.env.ICONFONT_URL,
	});
	// 获取表格实例
	const tableRef = useRef<ActionType>();
	// 获取树形数据传递给drawerForm
	const [treeData, setTreeData] = useState<API.ORGANIZATION[]>([])
	// 当前行数据
	const [currentRecord, setCurrentRecord] = useState<API.ORGANIZATION>()
	// 判断是否是添加子级
	const [parent_id, set_parent_id] = useState<string>('')
	// 手动触发刷新表格
	function reloadTable() {
		tableRef?.current?.reload()
	}
	// 获取用户列表
	const { data: userList } = useRequest<PageResModel<API.USERMANAGEMENT>, PaginationProps[]>(
		async (params) => formatResult(await getUserList(params)), {
		defaultParams: [{ current: 1, pageSize: 9999 }]
	});
	// 删除列表
	const handlerDelete = async (org_id: string): Promise<void> => {
		Modal.confirm({
			title: formatMessage({ id: 'global.message.delete.title' }),
			content: formatMessage({ id: 'global.message.delete.content' }),
			onOk: async () => {
				return new Promise<void>(async (resolve, reject): Promise<void> => {
					await delOrganization(org_id).then(res => {
						if (res.code === 200) {
							message.success(res.msg)
							// 刷新表格
							reloadTable()
							resolve()
						}
					})
					reject()
				})

			}
		})

	}
	/**
	* @description: 渲染操作下拉菜单子项
	* @param {API} record
	* @return {*}
	* @author: Cyan
	*/
	const DropdownMenu = (record: API.ORGANIZATION) => {
		return (
			[
				{
					name: <FormTemplate
						treeData={treeData}
						reloadTable={reloadTable}
						parent_id={parent_id}
						userList={userList?.list || []}
						triggerDom={
							<Button
								type="text"
								size="small"
								icon={<ClusterOutlined />}
								block
								onClick={() => set_parent_id(record.org_id)}
							>
								{formatMessage({ id: 'menu.administrative.organization.add-child' })}
							</Button>}
					/>,
					key: 'addChild',
				},
				{
					name: <FormTemplate
						treeData={treeData}
						reloadTable={reloadTable}
						formData={currentRecord}
						userList={userList?.list || []}
						triggerDom={
							<Button
								type="text"
								size="small"
								icon={<EditOutlined />}
								block
								onClick={() => setCurrentRecord(record)}
							>
								{formatMessage({ id: 'menu.administrative.organization.edit' })}
							</Button>}
					/>,
					key: 'edit',
				},
				{
					name: <Button
						block
						type="text"
						size="small"
						icon={<DeleteOutlined />} onClick={() => handlerDelete(record.org_id)} >
						{formatMessage({ id: 'menu.administrative.organization.delete' })}
					</Button>,
					key: 'delete',
				},
			]
		);
	}

	/**
* @description: proTable columns 配置项
* @return {*}
* @author: Cyan
*/
	const columns: ProColumns<API.ORGANIZATION>[] = [
		{
			title: formatMessage({ id: 'pages.administrative.organization.org_name' }),
			dataIndex: 'org_name',
			ellipsis: true,
			width: 140,
			render: text => <Space><IconFont type="icon-organization" style={{ color: initialState?.settings?.colorPrimary, fontSize: '16px' }} /><span>{text}</span></Space>
		},
		{
			title: formatMessage({ id: 'pages.administrative.organization.org_code' }),
			dataIndex: 'org_code',
			ellipsis: true,
			width: 120,
			render: text => <Tag color="cyan">{text}</Tag>
		},
		{
			title: formatMessage({ id: 'pages.administrative.organization.org_type' }),
			dataIndex: 'org_type',
			filters: true,
			onFilter: true,
			width: 100,
			valueEnum: ORG_TYPE_TAGS,
			render: (_, record) => <Tag color={ORG_TYPE_TAGS[record.org_type].color}>{ORG_TYPE_TAGS[record.org_type].text}</Tag>
		},
		{
			title: formatMessage({ id: 'global.status' }),
			dataIndex: 'status',
			width: 100,
			filters: true,
			onFilter: true,
			valueEnum: {
				0: { text: formatMessage({ id: 'global.status.disable' }), status: 'Default' },
				1: { text: formatMessage({ id: 'global.status.normal' }), status: 'Processing' },
			},
		},
		{
			title: formatMessage({ id: 'global.table.sort' }),
			dataIndex: 'sort',
			ellipsis: true,
			hideInSearch: true,
			width: 100,
			sorter: true,
			render: text => <Tag color="purple">{text}</Tag>
		},
		{
			title: formatMessage({ id: 'global.table.created_time' }),
			dataIndex: 'created_time',
			valueType: 'date',
			hideInSearch: true,
			sorter: true,
			width: 120,
			render: text => (
				<Space>
					<ClockCircleOutlined /><span>{text}</span>
				</Space>
			)
		},
		{
			title: formatMessage({ id: 'global.table.created_time' }),
			dataIndex: 'created_time',
			valueType: 'dateRange',
			hideInTable: true,
			search: {
				transform: (value) => {
					return {
						start_time: moment(value[0]._d).format('YYYY-MM-DD 00:00:00'),
						end_time: moment(value[1]._d).format('YYYY-MM-DD 23:59:59'),
					};
				},
			},
		},
		{
			title: formatMessage({ id: 'global.table.describe' }),
			dataIndex: 'describe',
			ellipsis: true,
			width: 140,
			hideInSearch: true
		},
		{
			title: formatMessage({ id: 'global.table.operation' }),
			valueType: 'option',
			width: 80,
			align: 'center',
			key: 'option',
			render: (_, record) => [
				<TableDropdown key="actionGroup" menus={DropdownMenu(record)}>
					<Button size="small">
						{formatMessage({ id: 'global.table.operation' })}
						<DownOutlined />
					</Button>
				</TableDropdown>,
			]
		},
	]

	return (
		<ProTable<API.ORGANIZATION, TableSearchProps>
			actionRef={tableRef}
			columns={columns}
			request={async (params: TableSearchProps): Promise<RequestData<API.ORGANIZATION>> => {
				{
					// 这里需要返回一个 Promise,在返回之前你可以进行数据转化
					// 如果需要转化参数可以在这里进行修改
					const response = await getOrganizationList(params).then(res => {
						setTreeData(res.data)
						return {
							data: res.data,
							// success 请返回 true，不然 table 会停止解析数据，即使有数据
							success: res.code === 200,
						}
					})
					return Promise.resolve(response)
				}
			}
			}
			rowKey="org_id"
			pagination={false}
			// 工具栏
			toolBarRender={() => [
				<FormTemplate treeData={treeData} reloadTable={reloadTable} userList={userList?.list || []} key="FormTemplate" />
			]}
			scroll={{ x: columnScrollX(columns) }}
		/>
	)
}
export default TableTemplate