<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NLayout, useMessage } from 'naive-ui'
import RenderVue from '#/Render.vue'
import http from '@/net/http'


const message = useMessage()
const route = useRoute()
const router = useRouter()
const project = ref<any | null>(null)
const current_api = ref<number | null>(null)

const handleGetApis = async () => {
    let res = await http.get<any>(`/api/${route.params.project_id}`)
    if (res.code === 40000) {
        router.push({ name: 'AdminProject' })
    } else if (res.code === 10000) {
        project.value = res.data
    } else {
        message.error(res.data.message)
    }
    res.data.forEach((api: any) => {
        console.log(JSON.parse(api.detail))
    })
}

const handleGetProject = async () => {
    let res = await http.get<any>(`/project/${route.params.project_id}`)
    if (res.code === 40000) {
        router.push({ name: 'AdminProject' })
    } else if (res.code === 10000) {
        project.value = res.data
        await handleGetApis()
    } else {
        message.error(res.data.message)
    }
}

onBeforeMount(async () => {
    if (!route.params.project_id) {
        router.push({
            name: 'AdminProject'
        })
    }
    if (route.params.api_id) {
        current_api.value = Number(route.params.api_id)
    }
    await handleGetProject()
})
</script>

<template>
    <n-layout class="api" content-style="width: 100%; height: 100%;">
        <div class="content">
            <RenderVue />
        </div>
    </n-layout>
</template>

<style scoped>
.api {
    width: 100%;
    height: 100%;
}

.content {
    margin: 60px 100px;
}
</style>
