
import _ from "lodash";
import { Dialect, Sequelize } from "sequelize";
import { AutoBuilder } from "./auto-builder";
import { AutoGenerator } from "./auto-generator";
import { AutoRelater } from "./auto-relater";
import { AutoWriter } from "./auto-writer";
import { dialects } from "./dialects/dialects";
import { AutoOptions, TableData } from "./types";

export class SequelizeAuto {
  sequelize: Sequelize;
  options: AutoOptions;

  constructor(database: string | Sequelize, username: string, password: string, options: AutoOptions) {
    // 针对 sqlite 和 mssql 单独进行参数配置
    if (options && options.dialect === 'sqlite' && !options.storage && database) {
      options.storage = database as string;
    }
    if (options && options.dialect === 'mssql') {
      // set defaults for tedious, to silence the warnings
      options.dialectOptions = options.dialectOptions || {};
      options.dialectOptions.options = options.dialectOptions.options || {};
      options.dialectOptions.options.trustServerCertificate = true;
      options.dialectOptions.options.enableArithAbort = true;
      options.dialectOptions.options.validateBulkLoadParameters = true;
    }

    if (database instanceof Sequelize) {
      this.sequelize = database;
    } else {
      // 初始化 sequelize 对象
      this.sequelize = new Sequelize(database, username, password, options || {});
    }

    // 属性继承
    this.options = _.extend({
      spaces: true,
      indentation: 2,
      directory: './models',
      additional: {},
      host: 'localhost',
      port: this.getDefaultPort(options.dialect), // 根据不同的数据库获取默认端口
      closeConnectionAutomatically: true // 关闭自动连接
    }, options || {});

    if (!this.options.directory) {
      this.options.noWrite = true;
    }

  }

  // 指令执行
  async run(): Promise<TableData> {
    let td = await this.build();
    td = this.relate(td);
    const tt = this.generate(td);
    td.text = tt;
    await this.write(td);
    return td;
  }

  build(): Promise<TableData> {
    const builder = new AutoBuilder(this.sequelize, this.options);
    return builder.build().then(tableData => {
      if (this.options.closeConnectionAutomatically) {
        return this.sequelize.close().then(() => tableData);
      }
      return tableData;
    });
  }

  relate(td: TableData): TableData {
    const relater = new AutoRelater(this.options);
    return relater.buildRelations(td);
  }

  generate(tableData: TableData) {
    const dialect = dialects[this.sequelize.getDialect() as Dialect];
    const generator = new AutoGenerator(tableData, dialect, this.options);
    return generator.generateText();
  }

  write(tableData: TableData) {
    const writer = new AutoWriter(tableData, this.options);
    return writer.write();
  }

  getDefaultPort(dialect?: Dialect) {
    switch (dialect) {
      case 'mssql':
        return 1433;
      case 'postgres':
        return 5432;
      default:
        return 3306;
    }
  }

}
module.exports = SequelizeAuto;
module.exports.SequelizeAuto = SequelizeAuto;
module.exports.default = SequelizeAuto;
