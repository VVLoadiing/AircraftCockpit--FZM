<script setup lang="ts">
/**
 * TechForm — 表单容器
 *
 * 职责：
 *  - 统一布局（labelWidth / labelPosition，通过 provide 传给 FormItem）
 *  - 校验编排：validate() 遍历所有注册的 FormItem 逐项校验，全过 resolve(true)
 *  - resetFields() 重置全部 FormItem
 *
 * 用法：
 *   <TechForm ref="formRef" :model="formData" :rules="rules">
 *     <TechFormItem label="名称" prop="name"><TechInput v-model="formData.name" /></TechFormItem>
 *     ...
 *   </TechForm>
 *   const valid = await formRef.value.validate()
 */
import { provide, ref } from 'vue'
import type { FormContext, FormItemContext, FormRules } from './types'

const props = withDefaults(
  defineProps<{
    /** 表单数据对象（与 FormItem 的 prop 对应） */
    model: Record<string, unknown>
    /** 校验规则 */
    rules?: FormRules
    /** 标签宽度 */
    labelWidth?: string
    /** 标签位置 */
    labelPosition?: 'left' | 'top' | 'right'
  }>(),
  {
    rules: () => ({}),
    labelWidth: '90px',
    labelPosition: 'left',
  },
)

/** 所有注册的 FormItem */
const items = ref<FormItemContext[]>([])

function registerItem(item: FormItemContext) {
  items.value.push(item)
}
function unregisterItem(item: FormItemContext) {
  const idx = items.value.indexOf(item)
  if (idx !== -1) items.value.splice(idx, 1)
}

/**
 * 整体校验：遍历所有 FormItem，任一失败则 resolve(false)。
 * @returns 是否全部通过
 */
async function validate(): Promise<boolean> {
  const results = await Promise.all(items.value.map((it) => it.validate()))
  return results.every((r) => r === '')
}

/** 清除全部错误状态 */
function clearErrors() {
  items.value.forEach((it) => it.clearError())
}

/** 重置全部 FormItem 到初始值 */
function resetFields() {
  items.value.forEach((it) => it.reset())
}

provide<FormContext>('techForm', {
  get model() {
    return props.model
  },
  get rules() {
    return props.rules
  },
  get labelWidth() {
    return props.labelWidth
  },
  get labelPosition() {
    return props.labelPosition
  },
  registerItem,
  unregisterItem,
})

defineExpose({ validate, resetFields, clearErrors })
</script>

<template>
  <form class="fzm-form" :class="`is-label-${labelPosition}`" @submit.prevent>
    <slot />
  </form>
</template>

<style scoped>
.fzm-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
