<script setup lang="ts">
/**
 * TechFormItem — 表单项
 *
 * 职责：
 *  - 布局：标签 + 控件插槽 + 错误提示（label 宽度/位置从 Form 注入）
 *  - 校验：依据 prop 在 Form.rules 中查找规则，blur/change 时自动校验；
 *    Form.validate() 时被统一调用
 *  - 状态：校验失败的红色文字 + 控件区错误态
 *
 * 校验规则：required / min&max（字符串长度或数值）/ pattern / validator（可异步）
 */
import { inject, ref, computed, onBeforeUnmount, watch } from 'vue'
import type { FormContext, FormItemContext, FormRule } from '../TechForm/types'

const props = withDefaults(
  defineProps<{
    /** 标签文字 */
    label?: string
    /** 对应 model 的字段名（必填，用于查 rules 与取值） */
    prop?: string
    /** 是否必填（视觉红星；不传则自动依据 rules 是否含 required） */
    required?: boolean
  }>(),
  {
    label: '',
    prop: '',
    required: false,
  },
)

const form = inject<FormContext | null>('techForm', null)

/** 当前错误信息（空串表示通过） */
const error = ref('')

/** 是否必填（优先 prop，否则查 rules 含 required） */
const isRequired = computed(() => {
  if (props.required) return true
  if (!form || !props.prop) return false
  return (form.rules[props.prop] ?? []).some((r) => r.required)
})

/** 取当前字段值 */
function getValue(): unknown {
  if (!form || !props.prop) return undefined
  return form.model[props.prop]
}

/** 执行单条规则校验，返回错误信息（'' 表示通过） */
async function runRule(rule: FormRule, value: unknown): Promise<string> {
  // 自定义 validator 优先
  if (rule.validator) {
    const res = await rule.validator(value, form?.model ?? {})
    if (res === true) return ''
    if (typeof res === 'string') return res
    return rule.message ?? '校验未通过'
  }

  // required
  if (rule.required) {
    const empty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    if (empty) return rule.message ?? '该项为必填'
  }

  // 长度 / 数值范围
  if (typeof value === 'string') {
    if (rule.min !== undefined && value.length < rule.min) {
      return rule.message ?? `至少 ${rule.min} 个字符`
    }
    if (rule.max !== undefined && value.length > rule.max) {
      return rule.message ?? `至多 ${rule.max} 个字符`
    }
  } else if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) return rule.message ?? `不能小于 ${rule.min}`
    if (rule.max !== undefined && value > rule.max) return rule.message ?? `不能大于 ${rule.max}`
  }

  // 正则
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return rule.message ?? '格式不正确'
  }

  return ''
}

/** 校验本项：遍历该字段的所有规则，返回第一条错误信息 */
async function validate(): Promise<string> {
  if (!form || !props.prop) {
    error.value = ''
    return ''
  }
  const rules = form.rules[props.prop] ?? []
  if (rules.length === 0) {
    error.value = ''
    return ''
  }
  const value = getValue()
  for (const rule of rules) {
    const msg = await runRule(rule, value)
    if (msg) {
      error.value = msg
      return msg
    }
  }
  error.value = ''
  return ''
}

function clearError() {
  error.value = ''
}

/* —— 值变化监听：trigger 含 change 的规则在值变化时自动校验 —— */
watch(
  () => (form && props.prop ? form.model[props.prop] : undefined),
  () => {
    if (!form || !props.prop) return
    const rules = form.rules[props.prop] ?? []
    if (rules.some((r) => r.trigger === 'change')) validate()
    // 值变化且有错误时，重新校验以清除错误（用户修正后）
    if (error.value) validate()
  },
)

/* —— blur 自动校验：监听插槽内控件的 blur 事件 ——
 * FormItem 无法直接接管子控件的事件，这里提供一个 onFieldBlur 方法，
 * 业务可在控件的 @blur 上调用。但更通用的做法：FormItem 监听自身 focusout（冒泡）。 */
function onFocusOut() {
  if (!form || !props.prop) return
  const rules = form.rules[props.prop] ?? []
  if (rules.some((r) => r.trigger === 'blur' || !r.trigger)) validate()
}

/** 重置：清错并恢复初始值（需 Form 协同，这里仅清错 + 触发 watch） */
const initialValue = ref<unknown>(undefined)
let inited = false
function reset() {
  if (!form || !props.prop) return
  // 记录初始值（首次 reset 前）
  if (!inited) {
    initialValue.value = form.model[props.prop]
    inited = true
  }
  // 注意：直接改 model 需父组件的 model 是响应式对象
  form.model[props.prop] = initialValue.value
  error.value = ''
}

/* —— 注册到 Form —— */
const itemCtx: FormItemContext = {
  get prop() {
    return props.prop
  },
  validate,
  clearError,
  reset,
}

if (form) {
  form.registerItem(itemCtx)
  // 记录初始值供 reset
  if (props.prop) initialValue.value = form.model[props.prop]
}

onBeforeUnmount(() => {
  form?.unregisterItem(itemCtx)
})

defineExpose({ validate, clearError })
</script>

<template>
  <div
    class="fzm-form-item"
    :class="{ 'is-error': !!error, 'is-required': isRequired }"
    @focusout="onFocusOut"
  >
    <!-- 标签 -->
    <label v-if="label" class="fzm-form-item__label" :style="form && form.labelPosition !== 'top' ? { width: form.labelWidth } : undefined">
      <span v-if="isRequired" class="fzm-form-item__star">*</span>
      {{ label }}
    </label>

    <!-- 控件 + 错误提示 -->
    <div class="fzm-form-item__content">
      <div class="fzm-form-item__control">
        <slot />
      </div>
      <Transition name="fzm-form-error">
        <p v-if="error" class="fzm-form-item__error">{{ error }}</p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fzm-form-item {
  display: flex;
  align-items: flex-start;
}

/* 标签 */
.fzm-form-item__label {
  flex-shrink: 0;
  padding-top: 6px;
  padding-right: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-secondary);
  text-align: right;
  box-sizing: border-box;
}

.fzm-form-item__star {
  color: var(--danger-light, #e09a9a);
  margin-right: 2px;
}

/* label 在顶部时 */
.is-label-top .fzm-form-item__label {
  width: auto !important;
  padding-top: 0;
  padding-bottom: 6px;
  text-align: left;
}
.is-label-top {
  flex-direction: column;
}

/* 内容区 */
.fzm-form-item__content {
  flex: 1;
  min-width: 0;
}

.fzm-form-item__control {
  transition: filter 0.2s ease;
}

/* 错误态：控件区轻微红色辉光提示 */
.fzm-form-item.is-error .fzm-form-item__control {
  filter: drop-shadow(0 0 4px rgb(var(--danger-rgb) / 0.4));
}

.fzm-form-item__error {
  margin: 5px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--danger-light, #e09a9a);
}

/* 错误提示淡入 */
.fzm-form-error-enter-active,
.fzm-form-error-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fzm-form-error-enter-from,
.fzm-form-error-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
</style>
