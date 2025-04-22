export enum ViewType {
  /**
   * 新增
   */
  ADD = "ADD",
  /**
   * 编辑
   */
  EDIT = "EDIT",
  /**
   * 查看
   */
  VIEW = "VIEW",
  /**
   * 补单
   */
  SUPPLY = "SUPPLY",
  /**
   * 复制
   */
  COPY = "COPY",
}

export const viewTitle = {
  [ViewType.ADD]: "新增",
  [ViewType.EDIT]: "编辑",
  [ViewType.VIEW]: "查看",
  [ViewType.SUPPLY]: "补单",
  [ViewType.COPY]: "复制",
}
