<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { NLayout, NLayoutHeader, NCard, NButton, NIcon, useMessage } from 'naive-ui'
import { ReturnDownBack, ApertureOutline } from '@vicons/ionicons5'
import http from '@/net/http'
import useCommonStore from '@/store/common'


window.$message = useMessage()
const router = useRouter()
const projects = ref<any[]>([])
const commonStore = useCommonStore()

const handleGetProjects = async () => {
    let res = await http.get<any>(`/project/public`)
    projects.value = res.data.projects
}

onBeforeMount(async () => {
    await handleGetProjects()
})

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
    <n-layout class="public">
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
                <div class="content">
                    <div class="mine">
                        <n-card style="margin-bottom: 10px" v-for="i in projects" size="small">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <n-button text
                                    @click="router.push({ name: 'PublicApi', params: { project_id: i.key } })">
                                    {{ i.name }}
                                </n-button>
                            </div>
                        </n-card>
                    </div>
                    <div class="partin"></div>
                </div>
            </n-layout>
        </n-layout>
    </n-layout>
</template>

<style scoped>
.public {
    width: 100%;
    height: 100%;
}

.content {
    max-width: 800px;
    margin: 60px auto;
    display: flex;
    flex-direction: column;
}
</style>
