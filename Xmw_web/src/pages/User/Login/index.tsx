/*
 * @Description: 登录页
 * @Version: 2.0
 * @Author: 白雾茫茫丶
 * @Date: 2022-09-08 11:09:03
 * @LastEditors: 白雾茫茫丶
 * @LastEditTime: 2023-09-27 15:54:05
 */

import { LoginForm } from '@ant-design/pro-components';
import { history, SelectLang, useIntl, useModel } from '@umijs/max'
import { useDebounceFn, useRequest } from 'ahooks';
import { Col, message, notification, Row, Tabs, TabsProps, Typography } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { eq } from 'lodash-es'
import React, { FC, useState } from 'react';

import Footer from '@/components/Footer'; // 全局页脚
import { Login } from '@/services/logic/login' // 登录相关接口
import { encryptionAesPsd, formatPerfix, setLocalStorageItem, timeFix } from '@/utils'
import { IconFont } from '@/utils/const'
import { LOCAL_STORAGE, LOGIN_TYPE, REQUEST_CODE, ROUTES } from '@/utils/enums'
import type { LoginParams, LoginType } from '@/utils/types/login'

import Account from './components/Account' // 账户密码登录
import Mobile from './components/Mobile' // 手机号码登录
import styles from './index.module.less'; // css 样式恩建

const LoginPage: FC = () => {
  dayjs.extend(relativeTime);
  const { formatMessage } = useIntl();
  // 初始化状态
  const { initialState, refresh } = useModel('@@initialState');
  // 用户登录类型
  const [loginType, setLoginType] = useState<LoginType>(LOGIN_TYPE.ACCOUNT);
  /**
   * @description: 用户登录接口
   * @Author: 白雾茫茫丶
   */
  const { run: runLogin } = useRequest(async (params) => await Login(params),
    {
      manual: true,
      onSuccess: async ({ code, data }) => {
        if (eq(code, REQUEST_CODE.SUCCESS)) {
          // 获取登录 token
          const { access_token, login_last_time } = data
          // 将 token 保存到localstorage
          setLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN, access_token)
          // 重新执行 getInitialState 方法，并获取新的全局初始状态
          await refresh().then(() => {
            setTimeout(() => {
              const urlParams = new URL(window.location.href).searchParams;
              // 路由跳转
              history.push(urlParams.get('redirect') || '/');
              // 欢迎语
              notification.success({
                message: `${timeFix()} 💕`,
                description: login_last_time ?
                  <span>
                    {formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'success.last-time') })}
                    <Typography.Text strong>{dayjs(login_last_time).fromNow()}</Typography.Text>
                  </span>
                  :
                  <Typography.Text strong>
                    {formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'success.first-login') })}
                  </Typography.Text>,
                icon:
                  <IconFont
                    type="icon-huanyingye"
                    style={{ color: initialState?.Settings?.colorPrimary, fontSize: '24px' }} />,
              })
            }, 100)
          })
        }
      },
    },
  )

  /**
   * @description: 登录表单提交
   * @param {LoginParams} values
   * @Author: 白雾茫茫丶
   */
  const { run: handleSubmit } = useDebounceFn(
    async (values: LoginParams): Promise<void> => {
      try {
        // 如果是账号密码登录，密码加密提交
        if (loginType === LOGIN_TYPE.ACCOUNT && values.password) {
          values.password = encryptionAesPsd(values.password)
        }
        // 如果是手机登录
        if (loginType === LOGIN_TYPE.MOBILE && values.captcha !== '1234') {
          message.error(formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'type.mobile.captcha.failure') }))
          return
        }
        // 调用登录接口
        runLogin({ ...values, type: loginType })
      } catch (error) {
        message.error(formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'failure') }));
      }
    },
    {
      wait: 300,
    },
  );

  /**
   * @description: Tabs 标签页配置
   * @Author: 白雾茫茫丶
   */
  const TbasItems: TabsProps['items'] = [
    {
      label: formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'type.account') }),
      key: LOGIN_TYPE.ACCOUNT,
      children: <Account />,
    },
    {
      label: formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'type.mobile') }),
      key: LOGIN_TYPE.MOBILE,
      children: <Mobile />,
    },
  ]

  return (
    <div className={styles.container}>
      {/* 国际化下拉框 */}
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang reload={false} />}
      </div>
      <Row justify="center" className={styles.content}>
        {/* 左侧背景 */}
        <Col className={styles['login-left']}>
          <div className={styles['login-bg']} />
        </Col>
        <Col className={styles['login-form']}>
          {/* 登录表单 */}
          <LoginForm
            logo={<img alt="logo" src="/logo.svg" />}
            title={initialState?.Settings?.title}
            subTitle={formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'subtitle') })}
            onFinish={async (values) => {
              await handleSubmit(values as LoginParams);
            }}
          >
            <Tabs
              destroyInactiveTabPane
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              items={TbasItems}
            />
          </LoginForm>
        </Col>
      </Row>
      {/* 底部版权 */}
      <Footer />
    </div>
  );
};

export default LoginPage;
