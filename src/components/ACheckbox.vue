<script setup lang="ts">
import { ref, watch } from 'vue'
import { NInput, NCheckbox } from 'naive-ui'

const props = withDefaults(defineProps<{
    value: boolean
    bg?: string
    onUpdateValue: (val: boolean) => void
    onBlur?: () => void
}>(), {
    bg: 'none'
})
const emits = defineEmits<{
    (e: 'update:value', val: boolean): void
}>()

const value = ref<boolean>(props.value)
const handleChange = async (val: boolean) => {
    value.value = val
    emits('update:value', val)
    props.onUpdateValue(val)
}
</script>
    
<template>
    <n-checkbox v-model:checked="value" @update:checked="handleChange" />
</template>
    
<style scoped>

</style>
    