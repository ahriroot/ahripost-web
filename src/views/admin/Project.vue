<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { NModal, NCard, NButton, NIcon, NInputGroup, NInput, NDivider, NTag, NSelect, useMessage } from 'naive-ui'
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
const handleGetMembers = async (key: string) => {
    getMembersLoading.value = true
    let res = await http.get<any>(`/member/${key}`)
    members.value = res.data
    getMembersLoading.value = false
}

const current_project_id = ref('')
const showSetting = ref(false)
const show = ref(true)
const handleShowSetting = async (key: string, s = true) => {
    show.value = s
    current_project_id.value = key
    await handleGetMembers(key)
    showSetting.value = true
}

const member = ref({
    id: 0,
    username: '',
    status: 0,
})
const addMemberLoading = ref(false)
const handleAddMember = async () => {
    if (current_project_id.value.length <= 0) return
    if (member.value.username.length <= 0) {
        window.$message.error('Please input username')
        return
    }
    addMemberLoading.value = true
    await http.post<any>(`/member/${current_project_id.value}`, {
        status: member.value.status,
        username: member.value.username,
    })
    await handleGetMembers(current_project_id.value)
    addMemberLoading.value = false
    member.value.username = ''
}

const handleSelectMember = (item: any) => {
    member.value = {
        id: item.id,
        username: item.member.username,
        status: item.status,
    }
}

const handleRemoveMember = async (_id: number) => {
    if (current_project_id.value.length <= 0) return
    await http.delete<any>(`/member/${current_project_id.value}/${_id}`)
    await handleGetMembers(current_project_id.value)
}

const tagTypes = ref(['default', 'success', 'warning', 'error', 'info'])
</script>

<template>
    <n-modal v-model:show="showSetting" class="custom-card" preset="card" style="width: 600px" title="Project"
        size="small" :bordered="false">
        <n-input-group v-if="show">
            <n-input placeholder="Member" v-model:value="member.username" />
            <n-select v-model:value="member.status" :options="[
                { label: '禁用', value: 0 },
                { label: '读写', value: 1 },
                { label: '只读', value: 2 },
            ]" />
            <n-button tertiary @click="handleAddMember" :loading="addMemberLoading">Update</n-button>
        </n-input-group>
        <n-divider v-if="show" />
        <div v-for="i in members">
            <n-tag closable @click="handleSelectMember(i)" @close="handleRemoveMember(i._id)"
                :type="(tagTypes[i.status] as any)">
                {{ i.member.username }}
            </n-tag>
        </div>
    </n-modal>
    <div class="content">
        <div class="mine">
            <n-card style="margin-bottom: 10px" v-for="i in projects" size="small">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <n-button text @click="router.push({ name: 'AdminApi', params: { project_id: i.key } })">
                        {{ i.name }}
                    </n-button>
                    <n-button quaternary @click="handleShowSetting(i.key)" :loading="getMembersLoading">
                        <template #icon>
                            <n-icon>
                                <Settings />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
            </n-card>
            <n-divider />
            <n-card style="margin-bottom: 10px" v-for="i in projects_by_member" size="small">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <n-button text @click="router.push({ name: 'AdminApi', params: { project_id: i.key } })">
                        {{ i.name }}
                    </n-button>
                    <n-button quaternary @click="handleShowSetting(i.key, false)" :loading="getMembersLoading">
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
</template>

<style scoped>
.content {
    max-width: 800px;
    margin: 60px auto;
    display: flex;
    flex-direction: column;
}
</style>
