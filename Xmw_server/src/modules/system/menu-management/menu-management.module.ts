/*
 * @Description: MenuManagement Module
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-10-19 11:19:47
 * @LastEditors: Cyan
 * @LastEditTime: 2023-01-17 16:23:44
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuManagementService } from './menu-management.service'; // MenuManagement Service
import { MenuManagementController } from './menu-management.controller'; // MenuManagement Controller
import { XmwMenu } from '@/models/xmw_menu.model'; // xmw_menu 实体
import { OperationLogsModule } from '@/modules/system/operation-logs/operation-logs.module'; // 系统设置-操作日志

@Module({
  // 将实体 导入到这个module中，以便你这个module中的其它provider使用
  imports: [SequelizeModule.forFeature([XmwMenu]), OperationLogsModule],
  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  controllers: [MenuManagementController],
  // 通过 @Module 装饰器映射 Crotroller
  providers: [MenuManagementService],
  // 如果你这个模块中的provider 要在别的模块中使用 你必须要在这里声明 导出这些provider
  exports: [MenuManagementService],
})
export class MenuManagementModule { }
