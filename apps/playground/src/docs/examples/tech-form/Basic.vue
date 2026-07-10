<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TechForm, TechFormItem, TechInput, TechSelect, TechRadioGroup, TechCheckbox, HudButton, Message } from '@fzm-tech-hud/ui'
import type { FormRules } from '@fzm-tech-hud/ui'

const formRef = ref()

const formData = reactive({
  name: '',
  code: '',
  type: '',
  level: 'normal',
  agree: false,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入设备编号' },
    { min: 3, max: 10, message: '编号长度 3-10 字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择设备类型' }],
  agree: [{ required: true, message: '请勾选协议' }],
}

const typeOptions = [
  { label: '注塑机', value: 'injection' },
  { label: '机械臂', value: 'arm' },
  { label: '传送带', value: 'belt' },
]
const levelOptions = [
  { label: 'normal', text: '常规' },
  { label: 'important', text: '重要' },
  { label: 'critical', text: '关键' },
]

async function onSubmit() {
  const valid = await formRef.value?.validate()
  if (valid) {
    Message.success('提交成功：' + formData.name)
  } else {
    Message.warning('请完善表单后再提交')
  }
}

function onReset() {
  formRef.value?.resetFields()
}
</script>

<template>
  <div style="max-width: 420px">
    <TechForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <TechFormItem label="设备名称" prop="name">
        <TechInput v-model="formData.name" placeholder="请输入设备名称" />
      </TechFormItem>

      <TechFormItem label="设备编号" prop="code">
        <TechInput v-model="formData.code" placeholder="3-10 字符" />
      </TechFormItem>

      <TechFormItem label="设备类型" prop="type">
        <TechSelect v-model="formData.type" :options="typeOptions" placeholder="请选择" />
      </TechFormItem>

      <TechFormItem label="重要等级" prop="level">
        <TechRadioGroup v-model="formData.level" :options="levelOptions" />
      </TechFormItem>

      <TechFormItem label="协议" prop="agree">
        <TechCheckbox v-model="formData.agree">我已阅读并同意</TechCheckbox>
      </TechFormItem>

      <TechFormItem label=" ">
        <div style="display: flex; gap: 10px">
          <HudButton type="primary" @click="onSubmit">提交</HudButton>
          <HudButton @click="onReset">重置</HudButton>
        </div>
      </TechFormItem>
    </TechForm>
  </div>
</template>
