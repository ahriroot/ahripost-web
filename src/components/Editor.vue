<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import * as monaco from 'monaco-editor'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import useCommonStore from '@/store/common';


const commonStore = useCommonStore()
const props = defineProps<{
    value: any
    readOnly?: boolean
}>()
const emits = defineEmits<{
    (e: 'handle', val: null): void
    (e: 'change', val: string): void
}>()

const monacoEditor = shallowRef<any>(null)
const editorRef = shallowRef<HTMLElement | null>(null)

self.MonacoEnvironment = {
    getWorker: () => new JsonWorker()
}
onMounted(() => {
    let json = ''
    try {
        json = JSON.stringify(JSON.parse(props.value), null, '\t')
    } catch (e) {
        json = ''
    }
    if (editorRef.value) {
        monacoEditor.value = monaco.editor.create(editorRef.value, {
            mouseWheelZoom: true,
            value: json,
            readOnly: props.readOnly ? true : false,
            theme: commonStore.theme == 'dark' ? 'vs-dark' : 'vs',
            selectOnLineNumbers: true,
            language: 'json',
            automaticLayout: true,
        })
        // monacoEditor.value?.trigger('format', 'editor.action.formatDocument')
        setTimeout(() => {
            monacoEditor.value?.getAction('editor.action.formatDocument').run()
        }, 100)
        // 监听值变化
        monacoEditor.value?.onDidChangeModelContent(() => {
            const currenValue = monacoEditor.value.getValue()
            emits('change', currenValue)
        })
    }
})

const setValue = async (val: string) => {
    let json = ''
    try {
        json = JSON.stringify(JSON.parse(val), null, '\t')
    } catch (e) {
        json = ''
    }
    monacoEditor.value?.setValue(json)
    monacoEditor.value?.getAction('editor.action.formatDocument').run()
}

const getValue = async (): Promise<string | undefined> => {
    return monacoEditor.value?.getValue()
}

const getSelectedValue = async () => {
    monacoEditor.value?.trigger('source', 'editor.action.clipboardCopyAction')
}

defineExpose({
    setValue, getValue, getSelectedValue
})
</script>
    
<template>
    <div ref="editorRef" class="code-editor"></div>
</template>
    
<style scoped>
.code-editor {
    width: 100%;
    height: 100%;
    min-height: 100px;
}
</style>
    