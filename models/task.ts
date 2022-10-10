import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  tableName: 'task',
  timestamps: false,
  indexes: [
   {
    name: "PRIMARY",
    unique: true,
    using: "BTREE",
    fields: [
     { name: "task_id" },
    ]
   },
  ]
})
export class TaskEntity extends Model {
  @Column({
   autoIncrement: true,
   type: DataType.INTEGER.UNSIGNED,
   allowNull: false,
   primaryKey: true,
   field: 'task_id'
  })
  taskId: number;

  @Column({
   type: DataType.TINYINT.UNSIGNED,
   allowNull: false,
   defaultValue: 0,
   comment: "任务所属应用ID: 0-无所属",
   field: 'app_id'
  })
  appId: number;

  @Column({
   type: DataType.STRING(64),
   allowNull: false,
   comment: "任务名称",
   field: 'task_name'
  })
  taskName: number;

  @Column({
   type: DataType.TINYINT.UNSIGNED,
   allowNull: false,
   defaultValue: 0,
   comment: "任务类别:1-cron,2-interval"
  })
  type: number;

  @Column({
   type: DataType.TINYINT.UNSIGNED,
   allowNull: false,
   defaultValue: 0,
   comment: "任务状态:0-暂停中,1-启动中"
  })
  status: number;

  @Column({
   type: DataType.DATE,
   allowNull: true,
   comment: "任务开始时间",
   field: 'start_time'
  })
  startTime: number;

  @Column({
   type: DataType.DATE,
   allowNull: true,
   comment: "任务结束时间",
   field: 'end_time'
  })
  endTime: number;

  @Column({
   type: DataType.INTEGER,
   allowNull: false,
   defaultValue: -1,
   comment: "任务执行次数"
  })
  limit: number;

  @Column({
   type: DataType.STRING(128),
   allowNull: true,
   defaultValue: "",
   comment: "任务cron配置"
  })
  cron: number;

  @Column({
   type: DataType.INTEGER.UNSIGNED,
   allowNull: true,
   defaultValue: 0,
   comment: "任务执行间隔时间"
  })
  every: number;

  @Column({
   type: DataType.STRING(255),
   allowNull: true,
   comment: "参数"
  })
  args: number;

  @Column({
   type: DataType.STRING(255),
   allowNull: true,
   comment: "备注"
  })
  remark: number;
}