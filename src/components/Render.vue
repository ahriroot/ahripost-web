<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'
import VditorPreview from 'vditor/dist/method.min'
import 'vditor/dist/index.css'

const previewRef = shallowRef<HTMLElement | null>(null);

const md = ref(`
# Hello World

\`\`\`python
class Hello:
    def __init__(self):
        print('Hello World')

hello = Hello()
\`\`\`

# Table

|1|2|3|4|
|-|-|-|-|
|a|b|c|d|

`);

onMounted(() => {
    VditorPreview.preview(previewRef.value, md.value, {
        mode: 'dark',
        hljs: {
            style: 'dracula'
        },
        theme: {
            current: 'dark'
        }
    })
})
</script>

<template>
    <div ref="previewRef" id="vditor" />
</template>
  
<style>

</style>
  