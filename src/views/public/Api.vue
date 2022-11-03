<script setup lang="ts">
import { ref, onBeforeMount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    NLayout, NLayoutHeader, NLayoutSider, NLayoutFooter,
    NTree, NButton, NIcon, NDropdown, NDrawer, NDrawerContent, NCard, NSpin,
    useMessage
} from 'naive-ui'
import { ReturnDownBack, CodeWorkingSharp, ApertureOutline } from '@vicons/ionicons5'
import RenderVue from '#/Render.vue'
import http from '@/net/http'
import useCommonStore from '@/store/common'
import renderMd from '@/utils/renderMd'
import renderCode from '@/utils/renderCode'


const commonStore = useCommonStore()
window.$message = useMessage()
const route = useRoute()
const router = useRouter()
const data = ref<any>([])
const expandedKeys = ref<string[]>([])
const project = ref<any>({
    name: ''
})
const apis = ref<any[]>([])
const current_api = ref<any>({
    _id: 0,
    key: ''
})
const render = ref<string>('')

const handleExpand = async (keys: string[]) => {
    expandedKeys.value = keys
    localStorage.setItem(`expandedKeys:${project.value.key}`, JSON.stringify(keys))
}

watch(() => route.params.api_id, async (key) => {
    if (key) {
        let api = apis.value.find((api) => api.key == key)
        render.value = await renderMd(api)
        current_api.value = api
    }
})


const download = async (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const showContextmenu = ref(false)
const optionsContextmenu = ref<any[]>([])
const xPos = ref(0)
const yPos = ref(0)
const nodeProps = ({ option }: { option: any }): any => {
    return {
        onClick() {
            if (option.type === 'api') {
                router.push({
                    name: 'PublicApi',
                    params: {
                        ...route.params,
                        api_id: option.value
                    }
                })
            }
        },
        onDblclick() {
            if (option.type === 'api') {
                router.push({
                    name: 'PublicApi',
                    params: {
                        ...route.params,
                        api_id: option.value
                    }
                })
            }
        },
        onContextmenu(e: MouseEvent): void {
            e.preventDefault()
            e.stopPropagation()
            if (option.type === 'api') {
                optionsContextmenu.value = [
                    {
                        label: '打开',
                        key: 'open',
                        props: {
                            onClick: async () => {
                                router.push({
                                    name: 'PublicApi',
                                    params: {
                                        ...route.params,
                                        api_id: option.value
                                    }
                                })
                                showContextmenu.value = false
                            }
                        }
                    },
                    {
                        label: '导出',
                        key: 'export',
                        props: {
                            onClick: async () => {
                                if (option.type === 'api') {
                                    let api: any = apis.value.find((api) => api.key == option.value)
                                    download(`${api.label}.md`, await renderMd(api));
                                }
                                showContextmenu.value = false
                            }
                        }
                    },
                ]
                xPos.value = e.clientX
                yPos.value = e.clientY
                showContextmenu.value = true
            }
        }
    }
}

const array2tree = async (arr: any[], parent: string) => {
    let tree: any[] = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].parent === parent) {
            if (arr[i].parent === parent) {
                let node: any = {
                    key: arr[i].key,
                    label: arr[i].label,
                    value: arr[i].key,
                    type: arr[i].type,
                }
                if (node.type == 'folder') {
                    node.children = await array2tree(arr, arr[i].key)
                }
                tree.push(node)
            }
        }
    }
    tree.sort((a: any, b: any) => (a.type > b.type) ? -1 : ((b.type > a.type) ? 1 : 0))
    return tree
}

const loading = ref(false)
const handleGetApis = async () => {
    loading.value = true
    let res = await http.get<any>(`/api/public/${route.params.project_id}`)
    if (res.code === 40000) {
        router.push({ name: 'PublicProject' })
    } else if (res.code === 10000) {
        apis.value = res.data
        if (route.params.api_id) {
            let tmp = apis.value.find((api) => api.key == route.params.api_id)
            render.value = await renderMd(tmp)
            tmp && (current_api.value = tmp)
        }
    } else {
        window.$message.error(res.data.message)
    }
    data.value = [{
        key: `project:${project.value.key}`,
        label: project.value.name,
        value: '',
        type: 'project',
        children: await array2tree(res.data, ''),
    }]
    loading.value = false
}

const handleGetProject = async () => {
    let res = await http.get<any>(`/project/public/${route.params.project_id}`)
    if (res.code === 40000) {
        router.push({ name: 'PublicProject' })
    } else if (res.code === 10000) {
        project.value = res.data
        await handleGetApis()
    } else {
        window.$message.error(res.data.message)
    }
}

const handleBack = async () => {
    router.push({ name: 'PublicProject' })
}

onBeforeMount(async () => {
    if (!route.params.project_id) {
        router.push({
            name: 'PublicProject'
        })
    }
    await handleGetProject()
    let keys_str = localStorage.getItem(`expandedKeys:${project.value.key}`)
    if (keys_str) {
        expandedKeys.value = JSON.parse(keys_str)
    }
})

const showCode = ref(false)
const showCodeLoading = ref(false)
const code = ref('')
const codeKey = ref(0)
const handleShowCode = async () => {
    showCodeLoading.value = true
    let api = apis.value.find((api) => api.key == route.params.api_id)
    code.value = await renderCode(api)
    codeKey.value = new Date().getTime()
    showCode.value = true
    showCodeLoading.value = false
}

const showDoc = ref(true)
const handleSetTheme = () => {
    if (commonStore.theme === 'dark') {
        commonStore.setTheme('light')
    } else {
        commonStore.setTheme('dark')
    }
    showDoc.value = false
    nextTick(() => {
        showDoc.value = true
    })
}
</script>

<template>
    <n-drawer v-model:show="showCode" width="80%" style="max-width: 1000px;" placement="right">
        <n-drawer-content title="Request Code">
            <RenderVue v-if="showDoc" :key="codeKey" :value="code" :theme="commonStore.theme" />
        </n-drawer-content>
    </n-drawer>
    <n-layout style="height: 100%">
        <n-layout-header style="height: 64px; padding: 18px" bordered>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                    <n-button quaternary circle @click="handleBack">
                        <template #icon>
                            <n-icon>
                                <ReturnDownBack />
                            </n-icon>
                        </template>
                    </n-button>&nbsp;&nbsp;
                    <span>{{ project.name }}</span>
                </div>
                <div>
                    <n-button quaternary circle @click="handleSetTheme" :loading="showCodeLoading">
                        <template #icon>
                            <n-icon>
                                <ApertureOutline />
                            </n-icon>
                        </template>
                    </n-button>&nbsp;
                    <n-button v-show="current_api._id > 0" quaternary circle @click="handleShowCode"
                        :loading="showCodeLoading">
                        <template #icon>
                            <n-icon>
                                <CodeWorkingSharp />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
            </div>
        </n-layout-header>
        <n-layout position="absolute" style="top: 64px; bottom: 32px" has-sider>
            <n-layout-sider class="nocopy" content-style="padding: 24px;" :native-scrollbar="false" bordered>
                <n-dropdown trigger="manual" size="small" placement="bottom-start" :show="showContextmenu"
                    :options="(optionsContextmenu as any)" :x="xPos" :y="yPos"
                    @clickoutside="showContextmenu = false" />
                <n-spin :show="loading">
                    <n-tree expand-on-click :data="data" @update:expanded-keys="handleExpand"
                        :default-expanded-keys="expandedKeys" :node-props="nodeProps" />
                </n-spin>
            </n-layout-sider>
            <n-layout content-style="padding: 24px;" :native-scrollbar="false">
                <n-card class="detail" size="small">
                    <RenderVue v-if="showDoc" :key="current_api._id" :value="render" :theme="commonStore.theme" />
                </n-card>
            </n-layout>
        </n-layout>
        <n-layout-footer position="absolute" style="height: 32px; padding: 6px 10px" bordered>
            <!-- copyright -->
            © ahriknow
        </n-layout-footer>
    </n-layout>
</template>

<style scoped>
.api {
    width: 100%;
    height: 100%;
}

.detail {
    max-width: 1000px;
    margin: 0 auto;
}
</style>
