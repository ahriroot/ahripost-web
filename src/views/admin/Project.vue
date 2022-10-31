<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import http from '@/net/http'


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
    <div id="project">
        <div v-for="i in projects">
            <router-link :to="{ name: 'AdminApi', params: { project_id: i._id } }">
                {{ i.name }}
            </router-link>
        </div>
    </div>
</template>

<style scoped>
#project {
    width: 100%;
    height: 100%;
}
</style>
