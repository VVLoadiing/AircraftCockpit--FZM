<script setup lang="ts">
import { computed } from 'vue'
import { useUiTheme, TechSelect } from '@fzm/ui'
import type { UiStyleOption } from '@fzm/ui'

const { style, setStyle, options } = useUiTheme()

/** 把主题选项映射为 TechSelect 的 options（携带 color 供插槽渲染彩色圆点） */
const selectOptions = computed(() =>
  options.map((o: UiStyleOption) => ({ label: o.name, value: o.id, color: o.color, desc: o.desc })),
)

function onChange(value: string | number) {
  setStyle(value as UiStyleOption['id'])
}

/** 取主题色（option.color 是 unknown，这里收敛为 string 给 style 用） */
function dotStyle(color: unknown) {
  return color ? { background: String(color) } : undefined
}
</script>

<template>
  <div class="theme-switcher">
    <span class="theme-switcher__label">主题</span>
    <TechSelect
      :model-value="style"
      :options="selectOptions"
      class="theme-switcher__select"
      @change="onChange"
    >
      <!-- 触发器：当前主题彩色圆点 + 名称 -->
      <template #trigger="{ label }">
        <span class="theme-switcher__trigger">
          <span class="theme-switcher__dot" :style="dotStyle(options.find((o) => o.id === style)?.color)" />
          <span class="theme-switcher__name">{{ label || '选择主题' }}</span>
        </span>
      </template>

      <!-- 选项：彩色圆点 + 名称 + 描述 -->
      <template #option="{ option }">
        <span class="theme-switcher__option">
          <span class="theme-switcher__dot" :style="dotStyle(option.color)" />
          <span class="theme-switcher__option-name">{{ option.label }}</span>
          <span class="theme-switcher__option-desc">{{ option.desc }}</span>
        </span>
      </template>
    </TechSelect>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-switcher__label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-secondary);
  text-transform: uppercase;
  flex-shrink: 0;
}

.theme-switcher__select {
  width: 180px;
}

/* 触发器：圆点 + 名称 */
.theme-switcher__trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
}

.theme-switcher__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--text-primary);
}

/* 选项：圆点 + 名称 + 描述（描述右对齐淡色） */
.theme-switcher__option {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
}

.theme-switcher__option-name {
  font-weight: 600;
  flex-shrink: 0;
}

.theme-switcher__option-desc {
  margin-left: auto;
  font-size: 10px;
  color: var(--text-muted);
  opacity: 0.7;
  white-space: nowrap;
}

/* 彩色圆点（触发器与选项共用）：内联 background 设颜色，这里只管形状 */
.theme-switcher__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
