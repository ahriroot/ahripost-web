<script setup lang="ts">
import { ref, watch } from 'vue'
import { NInput } from 'naive-ui'

const props = withDefaults(defineProps<{
    value: string | null
    bg?: string
    placeholder?: string
    readonly?: boolean
    clearable?: boolean
    onUpdateValue: (val: string | null) => void
    onBlur?: () => void
}>(), {
    bg: 'none',
    placeholder: '',
    readonly: false,
    clearable: true,
})
const emits = defineEmits<{
    (e: 'update:value', val: string | null): void
}>()

const inputRef = ref<any>(null)
const value = ref<string | null>(props.value)
const handleChange = async (val: string | null) => {
    value.value = val
    emits('update:value', val)
    props.onUpdateValue(val)
}
const handleClear = async () => {
    value.value = null
    emits('update:value', null)
    props.onUpdateValue(null)
}

watch(() => props.value, (val) => {
    value.value = val
})
</script>
    
<template>
    <n-input ref="inputRef" size="small" :value="value" @update:value="handleChange" @clear="handleClear"
        :placeholder="props.placeholder" :clearable="props.clearable" :readonly="props.readonly" />
</template>
    
<style scoped>
:deep(.n-input__state-border) {
    border: none !important;
}
</style>
    