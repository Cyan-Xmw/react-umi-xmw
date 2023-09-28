/*
 * @Description: International Service
 * @Version: 2.0
 * @Author: 白雾茫茫丶
 * @Date: 2022-10-15 22:06:24
 * @LastEditors: 白雾茫茫丶
 * @LastEditTime: 2023-09-28 16:25:30
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isUndefined, keys, omitBy } from 'lodash';
import { Op } from 'sequelize';
import type { WhereOptions } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

import { XmwInternational } from '@/models/xmw_international.model'; // xmw_international 实体
import { XmwUser } from '@/models/xmw_user.model'; // xmw_user 实体
import { OperationLogsService } from '@/modules/system/operation-logs/operation-logs.service'; // OperationLogs Service
import { initializeLang, initializeTree, responseMessage } from '@/utils'; // 全局工具函数
import type { Langs, Response, SessionTypes } from '@/utils/types';

import { ListInternationalDto, SaveInternationalDto } from './dto';
@Injectable()
export class InternationalService {
  constructor(
    // 使用 InjectModel 注入参数，注册数据库实体
    @InjectModel(XmwInternational)
    private readonly internationaModel: typeof XmwInternational,
    private sequelize: Sequelize,
    private readonly operationLogsService: OperationLogsService,
  ) { }

  /**
   * @description: 获取当前语言的国际化数据
   * @author: 白雾茫茫丶
   */
  async getAllLocalesLang(): Promise<Response<Partial<Langs>>> {
    const result: Partial<Langs> = {};
    // 查询数据
    const sqlData = await this.internationaModel.findAll({
      order: [['created_time', 'desc']], // 排序规则,
    });
    // 先将数据转成树形结构
    const treeLang = initializeTree(sqlData, 'id', 'parent_id', 'children');
    // 获取多语言
    const locales: string[] = keys({} as Langs);
    // 转成层级对象
    for (let i = 0; i < locales.length; i++) {
      const lang = locales[i];
      result[lang] = initializeLang(treeLang, lang, 'name');
    }
    return responseMessage(result);
  }

  /**
   * @description: 获取国际化列表
   * @author: 白雾茫茫丶
   */
  async getInternationalList(
    internationalInfo: ListInternationalDto,
  ): Promise<Response<XmwInternational[]>> {
    // 解构参数
    const { name, start_time, end_time, isMenu } = internationalInfo;
    // 拼接查询参数
    const where: WhereOptions = {};
    if (name) where.name = { [Op.substring]: name };
    if (start_time && end_time)
      where.created_time = { [Op.between]: [start_time, end_time] };
    // 查询数据
    const sqlData = await this.internationaModel.findAll({
      attributes: {
        include: [[this.sequelize.col('u.cn_name'), 'founder_name']],
      },
      // 联表查询
      include: [
        {
          model: XmwUser,
          as: 'u',
          attributes: [],
        },
      ],
      raw: true,
      where,
      // 按时间倒序
      order: [
        ['sort', 'desc'],
        ['created_time', 'desc'],
      ], // 排序规则,
    });
    // 将数据转成树形结构
    const result = initializeTree(sqlData, 'id', 'parent_id', 'children');
    return responseMessage(
      isMenu
        ? result.filter(
          (element: XmwInternational) => element.name == 'menu',
        )[0].children
        : result,
    );
  }

  /**
   * @description: 创建国际化数据
   * @author: 白雾茫茫丶
   */
  async createInternational(
    internationalInfo: SaveInternationalDto,
    session: SessionTypes,
  ): Promise<Response<SaveInternationalDto>> {
    // 解构参数
    const { name, parent_id } = internationalInfo;
    // 相同层级名称不能相同
    const exist = await this.internationaModel.findOne({
      where: { name },
    });
    // 如果有结果，则证明已存在，这里存在两种情况，
    if (exist && exist.parent_id == parent_id) {
      return responseMessage({}, '同一层级 name 不能相同!', -1);
    }
    // 如果通过则执行 sql insert 语句
    const result = await this.internationaModel.create({
      ...internationalInfo,
      founder: session.currentUserInfo.user_id,
    });
    // 保存操作日志
    await this.operationLogsService.saveLogs(`创建国际化：${name}`);
    return responseMessage(result);
  }

  /**
   * @description: 更新国际化数据
   * @author: 白雾茫茫丶
   */
  async updateInternational(
    id: string,
    internationalInfo: SaveInternationalDto,
  ): Promise<Response<number[]>> {
    // 解构参数
    const { name, parent_id } = internationalInfo;
    // 判断 parent_id 是否和 id相同
    if (parent_id && parent_id === id) {
      return responseMessage({}, '父级不能和自己相同!', -1);
    }
    // 相同层级名称不能相同
    const existWhere = { name, id: { [Op.ne]: id }, parent_id };
    const exist = await this.internationaModel.findOne({
      where: omitBy(existWhere, isUndefined),
    });
    // 如果有结果，则证明已存在
    if (exist) {
      return responseMessage({}, '同一层级 name 不能相同!', -1);
    }
    // 如果通过则执行 sql update 语句
    const result = await this.internationaModel.update(internationalInfo, {
      where: { id },
    });
    // 根据主键查找出当前数据
    const currentInfo = await this.internationaModel.findByPk(id);
    // 保存操作日志
    await this.operationLogsService.saveLogs(`编辑国际化：${currentInfo.name}`);
    return responseMessage(result);
  }

  /**
   * @description: 删除国际化数据
   * @author: 白雾茫茫丶
   */
  async deleteInternational(id: string): Promise<Response<number>> {
    // 判断当前数据是否有子级，如果有数据的parent_id是id，则存在子级
    const exist = await this.internationaModel.findOne({
      where: { parent_id: id },
    });
    // 如果有结果，则证明已存在
    if (exist) {
      return responseMessage({}, '当前数据存在子级，不能删除!', -1);
    }
    // 根据主键查找出当前数据
    const currentInfo = await this.internationaModel.findByPk(id);
    // 如果通过则执行 sql delete 语句
    const result = await this.internationaModel.destroy({ where: { id } });
    // 保存操作日志
    await this.operationLogsService.saveLogs(`删除国际化：${currentInfo.name}`);
    return responseMessage(result);
  }
}
