<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import useAuthStore from '@/store/auth'
import { NConfigProvider, darkTheme } from 'naive-ui'

onBeforeMount(async () => {
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
