<script lang="ts" setup>
const emit = defineEmits()

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})
const menu = ref<HTMLElement | null>(null)
onClickOutside(menu, (e) => {
  const target = e.target as HTMLElement
  if (
    target === menuBtn ||
    target === menuBtn.firstChild ||
    target === menuBtn.firstChild?.firstChild
  ) {
    emit('close')
  }
  emit('close')
})
const { menuBtn } = defineProps<{
  menuBtn: HTMLElement
}>()
</script>
<template>
  <ul
    class="mt-3 z-[1] p-2 shadow-center menu menu-sm dropdown-content bg-neutral rounded-box"
    ref="menu"
  >
    <slot />
  </ul>
</template>
