<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import useAuthStore from '@/store/auth'
import useCommonStore from '@/store/common'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import axios from 'axios'


const authStore = useAuthStore()
const commonStore = useCommonStore()
onBeforeMount(async () => {
    await authStore.updateToken(localStorage.getItem('token') || '')
    await commonStore.setTheme(localStorage.getItem('theme') || 'dark')
    window.$apiUrl = import.meta.env.VITE_BASE_URL_HTTP as string
    if (window.$apiUrl.length == 0 || !window.$apiUrl.startsWith('http')) {
        axios.get('/env.json').then(res => {
            window.$apiUrl = res.data.apiUrl
        })
    }
})
</script>

<template>
    <n-config-provider :theme="commonStore.theme == 'dark' ? darkTheme : null">
        <n-message-provider>
            <RouterView />
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped>

</style>
