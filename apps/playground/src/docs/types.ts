/**
 * 组件文档体系类型定义
 *
 * 每个组件对应一份 ComponentDoc 配置（介绍 / Props / Slots / Events），
 * 配合若干个示例文件（.vue，渲染真实效果 + 展示源码）。
 * registry.ts 汇总全部组件配置 + 分类，供 DocLayout 侧边目录、
 * ComponentDocView 按 :name 查找使用。
 */

/** 单个 Prop 说明 */
export interface PropMeta {
  name: string
  type: string
  default: string
  desc: string
}

/** 单个 Slot 说明 */
export interface SlotMeta {
  name: string
  desc: string
}

/** 单个 Event 说明 */
export interface EventMeta {
  name: string
  params: string
  desc: string
}

/** 单个示例：组件实例（渲染预览） + 源码字符串（展示代码） */
export interface DemoMeta {
  /** 示例标题 */
  title: string
  /** 示例 Vue 组件（已 import 进来的真实组件，渲染实际效果） */
  component: unknown
  /** 该示例的源码字符串（通过 ?raw 导入，与 component 同源，保证所见即所得） */
  source: string
}

/** 一份完整的组件文档 */
export interface ComponentDoc {
  /** 组件 kebab-case 名，作为路由参数与唯一标识 */
  name: string
  /** 组件展示名（如 TechCard） */
  title: string
  /** 分类 */
  category: ComponentCategory
  /** 一句话简介 */
  description: string
  /** 介绍正文（支持多段，渲染为段落） */
  intro?: string[]
  /** 示例列表 */
  demos: DemoMeta[]
  /** Props 表 */
  props?: PropMeta[]
  /** Slots 表 */
  slots?: SlotMeta[]
  /** Events 表 */
  events?: EventMeta[]
}

/** 组件分类（与侧边目录分组对应） */
export type ComponentCategory =
  | '基础容器'
  | '数据展示'
  | '反馈与标识'
  | '输入与导航'
  | '布局'

/** registry 中单个组件的注册项：延迟加载的组件文档 */
export interface ComponentDocEntry {
  name: string
  title: string
  category: ComponentCategory
  /** 延迟加载组件文档配置（路由进入该组件页时才 import） */
  loader: () => Promise<{ default: ComponentDoc }>
}

/** 分类目录分组 */
export interface CategoryGroup {
  title: ComponentCategory
  items: { name: string; title: string }[]
}
