<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@fzm-tech-hud/ui'

// 限定拖动的舞台（卡片不拖出此区域）
const stageRef = ref<HTMLElement | null>(null)
// 被拖动的卡片
const cardRef = ref<HTMLElement | null>(null)

const { position, isDragging } = useDraggable(cardRef, {
  bounds: stageRef,
  onEnd: (pos) => {
    // 实际项目中这里通常做持久化（localStorage / 后端）
    console.log('[useDraggable] 拖动结束', pos)
  },
})

function reset() {
  position.value = { x: 0, y: 0 }
}
</script>

<template>
  <div style="width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 10px">
    <p style="font-size: 12px; color: var(--text-secondary); margin: 0">
      按住 <b>鼠标左键</b> 拖动下方卡片；右键保留原生菜单行为。
    </p>

    <!-- 限定舞台：卡片不可拖出此框 -->
    <div
      ref="stageRef"
      class="stage"
    >
      <div
        ref="cardRef"
        class="drag-card"
        :class="{ 'is-dragging': isDragging }"
        :style="{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }"
      >
        <div class="drag-card__label">左键拖我</div>
        <div class="drag-card__pos">
          x: {{ Math.round(position.x) }} &nbsp; y: {{ Math.round(position.y) }}
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 8px; align-items: center">
      <span style="font-size: 12px; color: var(--text-secondary)">
        状态：{{ isDragging ? '拖动中…' : '空闲' }}
      </span>
      <button class="reset-btn" @click="reset">重置位置</button>
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  height: 220px;
  border: 1px dashed var(--border-color, rgba(255, 255, 255, 0.15));
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.drag-card {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 130px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.18), rgba(0, 212, 255, 0.06));
  border: 1px solid rgba(0, 212, 255, 0.45);
  color: var(--text-primary, #e6f4ff);
  cursor: move;
  user-select: none;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
  /* transform 由 JS 绑定，走 GPU 合成层，不触发重排 */
  will-change: transform;
}

.drag-card.is-dragging {
  border-color: rgba(0, 212, 255, 0.9);
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.45);
  cursor: grabbing;
}

.drag-card__label {
  font-size: 14px;
  font-weight: 600;
}

.drag-card__pos {
  font-size: 11px;
  color: var(--text-secondary, rgba(230, 244, 255, 0.6));
  font-variant-numeric: tabular-nums;
}

.reset-btn {
  padding: 2px 10px;
  font-size: 12px;
  color: var(--text-primary, #e6f4ff);
  background: transparent;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
  border-radius: 4px;
  cursor: pointer;
}
.reset-btn:hover {
  border-color: rgba(0, 212, 255, 0.6);
  color: rgba(0, 212, 255, 1);
}
</style>
