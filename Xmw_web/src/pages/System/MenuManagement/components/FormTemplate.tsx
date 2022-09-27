/*
 * @Description: 新建表单
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-13 11:33:11
 * @LastEditors: Cyan
 * @LastEditTime: 2022-09-27 14:09:18
 */

// 引入第三方库
import { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';// antd 图标
import { ModalForm } from '@ant-design/pro-components'; // 高级组件
import { Button, Form, message } from 'antd'; // antd 组件库

// 引入业务组件
import FormTemplateItem from '../components/FormTemplateItem' // 表单组件 
import { saveMenu } from '@/services/system/menu-management' // 菜单管理接口
import { FormTemplateProps } from '../utils/interface' // 公共 interface
import { formatMessage } from '@/utils' // 引入工具类

const FormTemplate: FC<FormTemplateProps> = ({ treeData, reloadTable, formData, triggerDom, parent_id,menuData }) => {
    // 初始化表单
    const [form] = Form.useForm<API.MENUMANAGEMENT>();
    // 深克隆一份表单数据
    const [cloneFormData, setCloneFormData] = useState<API.MENUMANAGEMENT | undefined>(formData)
    const formTitle = cloneFormData && cloneFormData.menu_id ? `${formatMessage(['global.table.operation.edit', 'pages.system.menu-management.title'])}：${cloneFormData.name}` : formatMessage(['global.table.operation.add', 'pages.system.menu-management.title'])
    // 提交表单
    const handlerSubmit = async (values: API.MENUMANAGEMENT) => {
        // 提交数据
        let result = false
        const params = { ...cloneFormData, ...values }
        parent_id && (params.parent_id = parent_id)
        // 删除 children 属性
        params.routes && delete params.routes
        await saveMenu(params).then(res => {
            if (res.resCode === 200) {
                message.success(res.resMsg);
                reloadTable()
                // 重置表单
                form.resetFields()
                result = true
            }
        })
        return result
    }
    return (
        <ModalForm<API.MENUMANAGEMENT>
            title={formTitle}
            width={600}
            grid
            form={form}
            trigger={triggerDom ||
                <Button type="primary">
                    <PlusOutlined />
                    {formatMessage('global.table.operation.add')}
                </Button>
            }
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: false,
                maskClosable: false,
                onCancel: () => form.resetFields()
            }}
            // 提交数据时，禁用取消按钮的超时时间（毫秒）。
            submitTimeout={2000}
            onFinish={async (values) => {
                // 提交数据
                const isSuccess = await handlerSubmit(values)
                // 返回true关闭弹框，否则不关闭
                return isSuccess
            }}
            onVisibleChange={visiable => {
                if (visiable) {
                    form.setFieldsValue(formData);
                    setCloneFormData(formData)
                }
            }}
        >
            <FormTemplateItem treeData={treeData} parent_id={parent_id} menuData={menuData}/>
        </ModalForm>
    );
};

export default FormTemplate