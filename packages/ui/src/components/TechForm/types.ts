/**
 * 表单校验类型定义（TechForm / TechFormItem 共用）
 */

/** 单条校验规则 */
export interface FormRule {
  /** 是否必填 */
  required?: boolean
  /** 字符串最小长度 / 数值最小值 */
  min?: number
  /** 字符串最大长度 / 数值最大值 */
  max?: number
  /** 正则校验 */
  pattern?: RegExp
  /** 自定义校验函数：返回 true 通过、字符串表示错误信息、Promise 支持异步 */
  validator?: (value: unknown, model: Record<string, unknown>) => boolean | string | Promise<boolean | string>
  /** 校验失败的提示信息 */
  message?: string
  /** 触发时机（blur 失焦 / change 变化） */
  trigger?: 'blur' | 'change'
}

/** 一个字段的规则数组 */
export type FormRules = Record<string, FormRule[]>

/** FormItem 校验结果：错误信息（空字符串表示通过） */
export type ValidateResult = string

/** Form 对外暴露给 FormItem 的上下文（通过 provide 注入） */
export interface FormContext {
  /** 表单数据对象 */
  model: Record<string, unknown>
  /** 全部规则 */
  rules: FormRules
  /** 标签宽度 */
  labelWidth: string
  /** 标签位置 */
  labelPosition: 'left' | 'top' | 'right'
  /** FormItem 注册自己（用于 validate/reset 时统一通知） */
  registerItem: (item: FormItemContext) => void
  /** FormItem 注销自己 */
  unregisterItem: (item: FormItemContext) => void
}

/** FormItem 向上暴露的接口（供 Form 调用单项校验/重置） */
export interface FormItemContext {
  /** 对应 model 的字段名 */
  prop: string
  /** 校验本项，返回错误信息（'' 表示通过） */
  validate: () => Promise<ValidateResult>
  /** 清除本项错误状态 */
  clearError: () => void
  /** 重置本项到初始值 */
  reset: () => void
}
