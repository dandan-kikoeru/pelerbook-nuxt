<script lang="ts" setup>
const emit = defineEmits()

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})
const menu = ref<HTMLElement | null>(null)
onClickOutside(menu, (e: any) => {
  if (e.target === menuBtn || e.target.parentElement === menuBtn) {
    // console.log(e.target === menuBtn)
    // console.log(e.target.parentElement === menuBtn)
    emit('close')
  }
  emit('close')
  // console.log(e.target)
  // console.log(e.target.parentElement)
  // console.log(menuBtn)
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
