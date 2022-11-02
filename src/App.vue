<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import useAuthStore from '@/store/auth'
import useCommonStore from '@/store/common'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'


const authStore = useAuthStore()
const commonStore = useCommonStore()
onBeforeMount(async () => {
    await authStore.updateToken(localStorage.getItem('token') || '')
    await commonStore.setTheme(localStorage.getItem('theme') || 'dark')
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
