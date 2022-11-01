<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { NLayout, NCard, useMessage } from 'naive-ui'
import http from '@/net/http'


const message = useMessage()
const projects = ref<any[]>([])

const handleGetProjects = async () => {
    let res = await http.get<any>(`/project`)
    projects.value = res.data
}

onBeforeMount(async () => {
    await handleGetProjects()
})
</script>

<template>
    <n-layout class="project" content-style="width: 100%; height: 100%;">
        <div class="content">
            <div class="mine">
                <n-card v-for="i in projects" size="small">
                    <router-link :to="{ name: 'AdminApi', params: { project_id: i._id } }">
                        {{ i.name }}
                    </router-link>
                </n-card>
            </div>
            <div class="partin"></div>
        </div>
    </n-layout>
</template>

<style scoped>
a {
    color: #fff;
}

.project {
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
