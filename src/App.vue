<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import useAuthStore from '@/store/auth'
import useCommonStore from '@/store/common'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'


const authStore = useAuthStore()
const commonStore = useCommonStore()
const theme = ref<any>(darkTheme)
onBeforeMount(async () => {
    localStorage.setItem('theme', 'light')
    await authStore.updateToken(localStorage.getItem('token') || '')
    await commonStore.setTheme(localStorage.getItem('theme') || 'dark')
    theme.value = commonStore.theme == 'dark' ? darkTheme : null
})
</script>

<template>
    <n-config-provider :theme="theme">
        <n-message-provider>
            <RouterView />
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped>

</style>
