/*
 * @Description: 系统设置-国际化
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-02 14:07:00
 * @LastEditors: Cyan
 * @LastEditTime: 2022-09-30 10:22:38
 */
// 引入第三方库
import type { FC } from 'react';
import { useIntl } from '@umijs/max'
import { PageContainer } from '@ant-design/pro-components' // antd 高级组件

// 引入业务工具类
import TableTemplate from './components/TableTemplate'

const Internationalization: FC = () => {
    const { formatMessage } = useIntl();
    return (
        <PageContainer title={formatMessage({ id: 'pages.system.internationalization' })}>
            {/* 表格列表 */}
            <TableTemplate />
        </PageContainer>
    )
}
export default Internationalization