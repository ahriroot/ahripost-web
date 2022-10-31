<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import useAuthStore from '@/store/auth'
import http from '@/net/http'
import { NConfigProvider, darkTheme, useMessage } from 'naive-ui'


window.$message = useMessage()

onBeforeMount(async () => {
    // const data = await http.get('/admin/v1/test')
    // console.log(data)
})

const authStore = useAuthStore()
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <div id="index">
            <!-- {{authStore}} -->
            <RouterView />
        </div>
    </n-config-provider>
</template>

<style scoped>
#index {
    width: 100%;
    height: 100%;
}
</style>
