<script setup lang="ts">
import { useRouter } from 'vue-router'
import useCommonStore from '@/store/common'
import { NLayout, NButton, useMessage } from 'naive-ui'


window.$message = useMessage()
const router = useRouter()
const store = useCommonStore()

const handleSetTheme = () => {
    if (store.theme === 'dark') {
        store.setTheme('light')
    } else {
        store.setTheme('dark')
    }
}
</script>

<template>
    <n-layout class="index" style="height: 100%">
        <n-button @click="handleSetTheme">{{ store.theme }}</n-button>
        <n-button @click="router.push({ name: 'AdminProject' })">项目</n-button>
    </n-layout>
</template>

<style scoped>
.index {
    width: 100%;
    height: 100%;
}
</style>
