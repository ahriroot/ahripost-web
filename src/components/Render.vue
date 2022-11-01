<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'
import VditorPreview from 'vditor/dist/method.min'


import 'vditor/dist/index.css'
const props = defineProps<{
    value: string
    theme: string
}>()
const previewRef = shallowRef<HTMLElement | null>(null);

onMounted(() => {
    VditorPreview.preview(previewRef.value, props.value, {
        mode: props.theme,
        hljs: {
            style: 'native'  // monokai
        },
        theme: {
            current: props.theme,
            path: 'https://cdn.jsdelivr.net/npm/vditor@3.8.17/dist/css/content-theme'
        },
        markdown: {
            mark: true,
        }
    })
})
</script>

<template>
    <div ref="previewRef" id="vditor" />
</template>
  
<style>

</style>
  