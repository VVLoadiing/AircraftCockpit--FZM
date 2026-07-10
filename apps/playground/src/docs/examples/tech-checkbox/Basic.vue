<script setup lang="ts">
import { ref } from 'vue'
import { TechCheckbox, TechCheckboxGroup, TechRadio, TechRadioGroup } from '@fzm-tech-hud/ui'

const agree = ref(true)
const fruits = ref<string[]>(['apple', 'banana'])
const radioVal = ref('online')
const indeterminate = ref(true)

const fruitOptions = [
  { label: 'apple', text: '苹果' },
  { label: 'banana', text: '香蕉' },
  { label: 'orange', text: '橙子' },
  { label: 'grape', text: '葡萄' },
]
const statusOptions = [
  { label: 'online', text: '在线' },
  { label: 'offline', text: '离线' },
  { label: 'busy', text: '忙碌' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 22px; max-width: 360px">
    <!-- 独立 Checkbox -->
    <div>
      <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 8px">独立复选框</p>
      <div style="display: flex; gap: 16px">
        <TechCheckbox v-model="agree">同意协议</TechCheckbox>
        <TechCheckbox v-model="indeterminate" :indeterminate="indeterminate">半选态</TechCheckbox>
        <TechCheckbox :model-value="false" disabled>禁用</TechCheckbox>
      </div>
    </div>

    <!-- 复选框组 -->
    <div>
      <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 8px">复选框组（{{ fruits }}）</p>
      <TechCheckboxGroup v-model="fruits" :options="fruitOptions" />
    </div>

    <!-- 单选组（横向） -->
    <div>
      <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 8px">单选组（{{ radioVal }}）</p>
      <TechRadioGroup v-model="radioVal" :options="statusOptions" />
    </div>

    <!-- 单选组（纵向） -->
    <div>
      <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 8px">单选组（纵向）</p>
      <TechRadioGroup v-model="radioVal" :options="statusOptions" direction="vertical" />
    </div>
  </div>
</template>
