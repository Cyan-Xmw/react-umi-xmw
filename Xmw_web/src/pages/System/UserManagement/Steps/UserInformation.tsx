/*
 * @Description: 表单配置项
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-13 14:05:54
 * @LastEditors: Cyan
 * @LastEditTime: 2022-10-08 17:54:25
 */
// 引入第三方库
import type { FC } from 'react';
import { useIntl } from '@umijs/max'
import { TreeSelect } from 'antd' // antd 组件库
import { ProFormTreeSelect, ProFormCascader, ProFormTextArea } from '@ant-design/pro-components'; // antd 高级组件

import type { UserInformationProps } from '../utils/interface'
import cascaderOptions from '@/utils/pca-code.json' // 省市区级联数据

const UserInformation: FC<UserInformationProps> = ({ roleData, jobsData, organizationData }) => {
    const { formatMessage } = useIntl();
    return (
        <>
            {/* 所属角色 */}
            <ProFormTreeSelect
                name="role_id"
                label={formatMessage({ id: 'pages.system.user-management.role_id' })}
                colProps={{ span: 12 }}
                fieldProps={{
                    treeData: roleData,
                    allowClear: true,
                    fieldNames: {
                        label: 'role_name',
                        value: 'role_id'
                    },
                    showCheckedStrategy: TreeSelect.SHOW_ALL,
                    placeholder: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.role_id' })
                }}
                rules={[{ required: true, message: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.role_id' }) }]}
            />
            {/* 所属组织 */}
            <ProFormTreeSelect
                name="org_id"
                label={formatMessage({ id: 'pages.system.user-management.org_id' })}
                colProps={{ span: 12 }}
                fieldProps={{
                    treeData: organizationData,
                    allowClear: true,
                    fieldNames: {
                        label: 'org_name',
                        value: 'org_id'
                    },
                    showCheckedStrategy: TreeSelect.SHOW_ALL,
                    placeholder: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.org_id' })
                }}
                rules={[{ required: true, message: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.org_id' }) }]}
            />
            {/* 所属岗位 */}
            <ProFormTreeSelect
                name="jobs_id"
                label={formatMessage({ id: 'pages.system.user-management.jobs_id' })}
                colProps={{ span: 12 }}
                fieldProps={{
                    treeData: jobsData,
                    allowClear: true,
                    fieldNames: {
                        label: 'jobs_name',
                        value: 'jobs_id'
                    },
                    showCheckedStrategy: TreeSelect.SHOW_ALL,
                    placeholder: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.jobs_id' })
                }}
                rules={[{ required: true, message: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.jobs_id' }) }]}
            />
            {/* 所属城市 */}
            <ProFormCascader
                name="city"
                label={formatMessage({ id: 'pages.system.user-management.city' })}
                colProps={{ span: 12 }}
                fieldProps={{
                    options: cascaderOptions,
                    fieldNames: {
                        label: 'name',
                        value: 'code'
                    },
                }}
                rules={[{ required: true, message: formatMessage({ id: 'global.form.placeholder.seleted' }) + formatMessage({ id: 'pages.system.user-management.city' }) }]}
            />
            {/* 详细地址 */}
            <ProFormTextArea
                name="address"
                label={formatMessage({ id: 'pages.system.user-management.address' })}
                placeholder={formatMessage({ id: 'global.form.placeholder' }) + formatMessage({ id: 'pages.system.user-management.address' })}
                fieldProps={{
                    showCount: true,
                    maxLength: 200,
                    rows: 4
                }}
                rules={[{ required: true, message: formatMessage({ id: 'global.form.placeholder' }) + formatMessage({ id: 'pages.system.user-management.address' }) }]}
            />
        </>
    )
}
export default UserInformation