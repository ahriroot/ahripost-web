<script setup lang="ts">

import { h, ref, reactive, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NModal, NCard, NButton, NIcon, NInputGroup, NInput, NDivider, NTag, NSelect, useMessage, PaginationProps, NSpace } from 'naive-ui'
import { Settings, ReturnDownBack, ApertureOutline } from '@vicons/ionicons5'
import http from '@/net/http'
import useCommonStore from '@/store/common'


window.$message = useMessage()
const router = useRouter()
const commonStore = useCommonStore()

const loadData = async () => {
    loading.value = true
    let res = await http.get<any>(`/user?page=${pagination.page}&size=${pagination.pageSize}`)
    pagination.itemCount = res.data.count
    data.value = res.data.users
    loading.value = false
}


onBeforeMount(async () => {
    await loadData()
})

const showUpdate = ref(false)
const isEdit = ref(false)
const user = ref({
    _id: 0,
    username: '',
    password: '',
})
const handleUpdate = async () => {
    user.value.username = user.value.username.trim()
    user.value.password = user.value.password ? user.value.password.trim() : ''
    if (user.value.username === '') {
        window.$message.error('用户名不能为空')
        return
    }
    if (user.value.username == 'admin') {
        window.$message.error('用户名 admin 不被允许')
        return
    }
    if (user.value.password === '') {
        window.$message.error('密码不能为空')
        return
    }
    if (isEdit.value) {
        if (user.value._id <= 0) {
            window.$message.error('用户ID为空')
            return
        }
        await http.put<any>(`/user/${user.value._id}`, user.value)
        window.$message.success('修改成功')
    } else {
        await http.post<any>(`/user`, user.value)
        window.$message.success('添加成功')
    }
    await loadData()
    isEdit.value = false
    showUpdate.value = false
}

const data = ref([])
const loading = ref(true)
const columns = ref([
    {
        title: 'ID',
        key: '_id',
    },
    {
        title: 'Username',
        key: 'username',
    },
    {
        key: 'opera',
        width: 200,
        render: (row: any) => h(
            NSpace,
            {},
            {
                default: () => [
                    h(
                        NButton,
                        {
                            type: 'info',
                            size: 'small',
                            tertiary: true,
                            onClick: () => {
                                isEdit.value = true
                                showUpdate.value = true
                                user.value._id = row._id
                                user.value.username = row.username
                                user.value.password = ''
                            },
                        },
                        {
                            default: () => 'Edit',
                        }
                    ),
                    h(
                        NButton,
                        {
                            type: 'error',
                            size: 'small',
                            tertiary: true,
                            onClick: async () => {
                                await http.delete<any>(`/user/${row._id}`)
                                window.$message.success('删除成功')
                                await loadData()
                            },
                        },
                        {
                            default: () => 'Delete',
                        }
                    ),
                ],
            }
        ),
        title: () => h(
            NButton,
            {
                type: 'info',
                size: 'small',
                onClick: () => {
                    isEdit.value = false
                    showUpdate.value = true
                    user.value._id = 0
                    user.value.username = ''
                    user.value.password = ''
                },
            },
            {
                default: () => 'Add',
            }
        )
    }
])
const pagination = reactive<PaginationProps>({
    page: 1,
    pageCount: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 30, 40, 50],
})

const handleFiltersChange = (filters: any) => {
    if (!loading.value) {
        loading.value = true
        // TODO: sort
        loading.value = false
    }
}
const handlePageChange = async (currentPage: any) => {
    if (!loading.value) {
        loading.value = true
        pagination.page = currentPage
        await loadData()
        loading.value = false
    }
}
</script>

<template>
    <n-modal v-model:show="showUpdate" class="custom-card" preset="card" style="width: 600px"
        :title="isEdit ? 'Edit User' : 'Add User'" size="small" :bordered="false">
        <n-input-group>
            <n-input v-model:value="user.username" placeholder="Username" />
            <n-input v-model:value="user.password" placeholder="Password" />
            <n-button tertiary type="primary" @click="handleUpdate">Submit</n-button>
        </n-input-group>
    </n-modal>
    <div class="content">
        <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
            @update:filters="handleFiltersChange" @update:page="handlePageChange" />
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
