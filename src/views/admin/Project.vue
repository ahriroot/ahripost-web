<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { NLayout, NModal, NCard, NButton, NIcon, NInputGroup, NInput, NDivider, NTag, useMessage } from 'naive-ui'
import { Settings } from '@vicons/ionicons5'
import http from '@/net/http'


window.$message = useMessage()
const router = useRouter()
const projects = ref<any[]>([])
const projects_by_member = ref<any[]>([])

const handleGetProjects = async () => {
    let res = await http.get<any>(`/project`)
    projects.value = res.data.projects
    projects_by_member.value = res.data.projects_by_member
}

onBeforeMount(async () => {
    await handleGetProjects()
})

const getMembersLoading = ref(false)
const members = ref<any[]>([])
const handleGetMembers = async (_id: number) => {
    getMembersLoading.value = true
    let res = await http.get<any>(`/member/${_id}`)
    members.value = res.data
    getMembersLoading.value = false
}

const current_project_id = ref(0)
const showSetting = ref(false)
const handleShowSetting = async (_id: number) => {
    current_project_id.value = _id
    await handleGetMembers(_id)
    showSetting.value = true
}

const member = ref('')
const addMemberLoading = ref(false)
const handleAddMember = async () => {
    if (current_project_id.value <= 0) return
    addMemberLoading.value = true
    await http.post<any>(`/member/${current_project_id.value}`, {
        username: member.value,
    })
    await handleGetMembers(current_project_id.value)
    addMemberLoading.value = false
}

const handleRemoveMember = async (_id: number) => {
    if (current_project_id.value <= 0) return
    await http.delete<any>(`/member/${current_project_id.value}/${_id}`)
    await handleGetMembers(current_project_id.value)
}

const tagTypes = ref(['default', 'success', 'warning', 'error', 'info'])
</script>

<template>
    <n-modal v-model:show="showSetting" class="custom-card" preset="card" style="width: 600px" title="Project"
        size="small" :bordered="false">
        <n-input-group>
            <n-input placeholder="Member" v-model:value="member" />
            <n-button tertiary @click="handleAddMember" :loading="addMemberLoading">Add</n-button>
        </n-input-group>
        <n-divider />
        <div v-for="i in members">
            <n-tag closable @close="handleRemoveMember(i._id)" :type="tagTypes[i.status] as any">
                {{ i.member.username }}
            </n-tag>
        </div>
    </n-modal>
    <n-layout class="project" content-style="width: 100%; height: 100%;">
        <div class="content">
            <div class="mine">
                <n-card v-for="i in projects" size="small">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <n-button text @click="router.push({ name: 'AdminApi', params: { project_id: i.key } })">
                            {{ i.name }}
                        </n-button>
                        <n-button quaternary @click="handleShowSetting(i._id)" :loading="getMembersLoading">
                            <template #icon>
                                <n-icon>
                                    <Settings />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </n-card>
                <n-divider />
                <n-card v-for="i in projects_by_member" size="small">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <n-button text @click="router.push({ name: 'AdminApi', params: { project_id: i._id } })">
                            {{ i.name }}
                        </n-button>
                        <n-button quaternary @click="handleShowSetting(i._id)" :loading="getMembersLoading">
                            <template #icon>
                                <n-icon>
                                    <Settings />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
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
