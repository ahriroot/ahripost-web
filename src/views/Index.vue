<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import useCommonStore from '@/store/common'
import { NLayout, NButton, useMessage } from 'naive-ui'
import http from '@/net/http'


window.$message = useMessage()
const router = useRouter()
const store = useCommonStore()

onBeforeMount(async () => {
    // const data = await http.get('/admin/v1/test')
    // console.log(data)
})

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
