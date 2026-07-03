<script setup lang="ts">
import { useUiTheme } from '@fzm/ui'
// playground 通过 vite alias 直接消费 @fzm/ui 源码（开发期 HMR）

const { style, setStyle, options } = useUiTheme()
</script>

<template>
  <div class="theme-switcher">
    <span class="theme-switcher__label">主题</span>
    <div class="theme-switcher__list">
      <button
        v-for="opt in options"
        :key="opt.id"
        class="theme-switcher__item"
        :class="{ 'is-active': style === opt.id }"
        :style="{ '--dot': opt.color }"
        :title="`${opt.name} · ${opt.desc}`"
        @click="setStyle(opt.id)"
      >
        <span class="theme-switcher__dot" />
        <span class="theme-switcher__name">{{ opt.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.theme-switcher__label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.theme-switcher__list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.theme-switcher__item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid rgb(var(--primary-rgb) / 0.22);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.theme-switcher__item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
  border-color: rgb(var(--primary-rgb) / 0.5);
}

.theme-switcher__item.is-active {
  color: var(--text-primary);
  background: rgb(var(--primary-rgb) / 0.2);
  border-color: rgb(var(--primary-rgb) / 0.7);
  box-shadow: inset 0 0 12px rgb(var(--primary-rgb) / 0.18);
}

.theme-switcher__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dot);
  box-shadow: 0 0 6px var(--dot);
}
</style>
