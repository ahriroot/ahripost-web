<script setup lang="ts">

import { h, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NSpace, useMessage } from 'naive-ui'
import http from '@/net/http'
import useCommonStore from '@/store/common'


window.$message = useMessage()
const router = useRouter()
const commonStore = useCommonStore()

const loadData = async () => {
    loading.value = true
    let res = await http.get<any>(`/token`)
    data.value = res.data
    loading.value = false
}


onBeforeMount(async () => {
    await loadData()
})

const data = ref([])
const loading = ref(true)
const columns = ref([
    {
        title: 'ID',
        key: '_id',
    },
    {
        title: 'Tokenname',
        key: 'token',
    },
    {
        key: 'opera',
        width: 200,
        render: (row: any) => h(
            NSpace,
            {},
            {
                default: () => h(
                    NButton,
                    {
                        type: 'error',
                        size: 'small',
                        tertiary: true,
                        onClick: async () => {
                            await http.delete<any>(`/token/${row._id}`)
                            window.$message.success('删除成功')
                            await loadData()
                        },
                    },
                    {
                        default: () => 'Delete',
                    }
                ),
            }
        ),
        title: () => h(
            NButton,
            {
                type: 'info',
                size: 'small',
                onClick: async () => {
                    await http.post<any>(`/token`)
                    window.$message.success('添加成功')
                    await loadData()
                },
            },
            {
                default: () => 'Add',
            }
        )
    }
])
</script>

<template>
    <div class="content">
        <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" />
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
