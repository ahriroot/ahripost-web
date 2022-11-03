<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NLayout, NLayoutHeader, NButton, NIcon, useMessage } from 'naive-ui'
import { ReturnDownBack, ApertureOutline } from '@vicons/ionicons5'
import useCommonStore from '@/store/common'


window.$message = useMessage()
const router = useRouter()
const commonStore = useCommonStore()

const handleBack = async () => {
    router.push({ name: 'Index' })
}
const handleSetTheme = () => {
    if (commonStore.theme === 'dark') {
        commonStore.setTheme('light')
    } else {
        commonStore.setTheme('dark')
    }
}
</script>

<template>
    <n-layout id="admin">
        <n-layout-header style="height: 64px; padding: 18px" bordered>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                    <n-button quaternary circle @click="handleBack">
                        <template #icon>
                            <n-icon>
                                <ReturnDownBack />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
                <div>
                    <n-button quaternary circle @click="handleSetTheme">
                        <template #icon>
                            <n-icon>
                                <ApertureOutline />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
            </div>
        </n-layout-header>
        <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>
            <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                <RouterView />
            </n-layout>
        </n-layout>
    </n-layout>
</template>

<style scoped>
#admin {
    width: 100%;
    height: 100%;
}
</style>
