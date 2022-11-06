<script setup lang="ts">
import { h, ref, shallowRef, computed, onBeforeMount, onMounted } from 'vue'
import {
    NLayout, NTag, NInputGroup, NButton, NInput, NSpin, NIcon, NPopselect,
    NSelect, NTabs, NTabPane, NDataTable, SelectOption, DataTableColumns,
    NRadioGroup, NSpace, NRadio, NUpload, NPopover, NDivider
} from 'naive-ui'
import { Add, Remove, Send, CloudUpload, CodeWorkingSharp } from '@vicons/ionicons5'
import axios from 'axios'
import AInput from './AInput.vue'
import ACheckbox from './ACheckbox.vue'
import Editor from './Editor.vue'


const props = defineProps<{
    api: any
    project: string
}>()

const data = ref<any>(null)
const options = shallowRef<SelectOption[]>([
    {
        label: 'GET',
        value: 'GET',
    },
    {
        label: 'POST',
        value: 'POST',
    },
    {
        label: 'PUT',
        value: 'PUT',
    },
    {
        label: 'DELETE',
        value: 'DELETE',
    },
    {
        label: 'PATCH',
        value: 'PATCH',
    }
])
const showLoading = ref<boolean>(false)
const href = computed({
    get() {
        return data.value.request?.path || ''
    },
    set(val: string) {
        data.value.request.path = val
    }
})

onBeforeMount(async () => {
    let h = localStorage.getItem('divider-height')
    if (h) {
        height.value = parseInt(h)
    } else {
        height.value = 400
        localStorage.setItem('divider-height', height.value.toString())
    }
    let tmp = JSON.parse(JSON.stringify(props.api))
    tmp.request = JSON.parse(tmp.request)
    tmp.response = JSON.parse(tmp.response)
    data.value = tmp
})

const instance = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
const handleSend = async () => {
    showLoading.value = true

    let envs: any[] = []
    let es: any = { environs: [] } //await Environ.where({ name: env.value }).get()
    envs = es.environs.map((item: any) => {
        return {
            key: item.key,
            value: item.value
        }
    })

    let strPath = data.value.request.path.replace(/\{\{(.+?)\}\}/g, (...args: any) => {
        let name: string = args[1]
        if (name) {
            name = name.trim()
            let env = envs.find((item) => item.key == name)
            if (env) {
                return env.value
            }
            return name
        }
        return name
    })

    let query = data.value.request.query.filter((item: any) => data.value.request.query_keys.includes(item.key)).map((item: any) => {
        return {
            field: item.field,
            value: item.value.replace(/\{\{(.+?)\}\}/g, (...args: any) => {
                let name: string = args[1]
                if (name) {
                    name = name.trim()
                    let env = envs.find((item) => item.key == name)
                    if (env) {
                        return env.value
                    }
                    return `{{${name}}}`
                }
                return name
            })
        }
    })
    let search = query.map((item: any) => {
        return `${item.field}=${item.value}`
    }).join('&')

    let headers = data.value.request.headers.filter((item: any) => data.value.request.headers_keys.includes(item.key)).map((item: any) => {
        return {
            field: item.field,
            value: item.value.replace(/\{\{(.+?)\}\}/g, (...args: any) => {
                let name: string = args[1]
                if (name) {
                    name = name.trim()
                    let env = envs.find((item) => item.key == name)
                    if (env) {
                        return env.value
                    }
                    return `{{${name}}}`
                }
                return name
            })
        }
    })
    if (!headers.some((item: any) => item.field.trim().toLowerCase() === 'content-type')) {
        if (data.value.request.body.type === 'form') {
            headers.push({
                field: 'Content-Type',
                value: 'application/x-www-form-urlencoded'
            })
        } else if (data.value.request.body.type === 'json') {
            headers.push({
                field: 'Content-Type',
                value: 'application/json'
            })
        }
    }
    // let form = data.value.request.body.form.filter((item: any) => data.value.request.body.form_keys.includes(item.key)).map((item: any) => {
    //     let file = []
    //     if (item.file) {
    //         file = item.file.map((file: any) => {
    //             return file.file
    //         })
    //     }
    //     return {
    //         field: item.field,
    //         value: item.value,
    //         value_type: item.type,
    //         file: file
    //     }
    // })
    let str = JSON.stringify(data.value.request.body.json)
    let json = str.replace(/\{\{(.+?)\}\}/g, (...args: any) => {
        let name: string = args[1]
        if (name) {
            name = name.trim()
            let env = envs.find((item) => item.key == name)
            if (env) {
                return env.value
            }
            return name
        }
        return name
    })

    let req = {
        method: data.value.request.method,
        url: strPath + (search ? '?' + search : ''),
        headers: data.value.request.headers.filter((item: any) => data.value.request.headers_keys.includes(item.key)).reduce((prev: any, cur: any) => {
            prev[cur.field] = cur.value
            return prev
        }, {}),
        data: JSON.parse(json)
    }
    try {
        let response = await instance(req)
        data.value.response.tab = 'body'
        data.value.response.datetime = new Date().getTime()

        if (response == undefined) {
            data.value.response.status = -1
            data.value.response.statusText = 'Error'
            data.value.response.headers = []
            data.value.response.body.type = 'raw'
            // data.value.response.body.text = response.error
        } else {
            data.value.response.status = response.status
            data.value.response.statusText = response.statusText
            let headers = []
            for (let key in response.headers) {
                headers.push({
                    field: key,
                    value: response.headers[key]
                })
            }
            data.value.response.headers = headers

            let contentType = data.value.response.headers.find((item: any) => item.field.toLowerCase() === 'content-type')
            if (contentType) {
                if (contentType.value.includes('application/json')) {
                    data.value.response.body.type = 'pretty'
                    data.value.response.body.json = response.data

                    if (responseRef.value && data.value.response?.body) {
                        responseRef.value.setValue(JSON.stringify(response.data, null, 4))
                    }
                } else if (contentType.value.includes('text/html')) {
                    data.value.response.body.type = 'preview'
                    data.value.response.body.html = response.data
                } else {
                    data.value.response.body.type = 'raw'
                    data.value.response.body.text = response.data
                }
            } else {
                data.value.response.body.type = 'raw'
                data.value.response.body.text = response.data
            }
        }
        showLoading.value = false
    } catch (error: any) {
        window.$message.error(error.message)
        showLoading.value = false
    }
}


const height = ref(500)
const dividerRef = shallowRef<HTMLElement | null>(null)
const resizeable = ref<boolean>(false)
const oldHeight = ref(height.value)
const moveHeight = ref(400)
const requestRef = shallowRef<any>(null)
const responseRef = shallowRef<any>(null)
const handleMouseDown = (e: MouseEvent) => {
    moveHeight.value = e.clientY
    oldHeight.value = height.value
    console.log('mousedown', e.clientY)
    resizeable.value = true
}
const handleMouseUp = (e: MouseEvent) => {
    console.log('mouseup')
    resizeable.value = false
}
onMounted(() => {
    if (dividerRef.value) {
        document.body.addEventListener('mousemove', (ev) => {
            if (resizeable.value) {
                let move = ev.clientY - moveHeight.value
                let newH = oldHeight.value + move
                if (newH <= 150) {
                    height.value = 150
                    return
                }
                if (newH >= document.body.offsetHeight - 100) {
                    height.value = document.body.offsetHeight - 100
                    return
                }
                height.value = newH
            }
        })
        document.body.addEventListener('mouseup', (_) => {
            resizeable.value = false
            localStorage.setItem('divider-height', height.value.toString())
        })
    }
})

const env = ref('')
const environs = ref<any[]>([])
const handleEnvChange = async () => {
    let envs: any[] = [] //await Environ.all()
    environs.value = envs.map((env: any) => {
        return {
            label: env.name,
            value: env.name,
            key: env.key
        }
    })
}
const handleChangeEnv = async (env: string) => {
    localStorage.setItem(`environ:${props.project}`, env)
}

const columns = ref<DataTableColumns<any>>([
    {
        type: 'selection',
    },
    {
        title: 'Key',
        key: 'key',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.field,
                        placeholder: 'Key',
                        onUpdateValue: (val: any) => {
                            row.field = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Value',
        key: 'value',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.value,
                        placeholder: 'Value',
                        onUpdateValue: (val: any) => {
                            row.value = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Default',
        key: 'default',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.default,
                        placeholder: 'Default',
                        onUpdateValue: (val: any) => {
                            row.default = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Describe',
        key: 'describe',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.describe,
                        placeholder: 'Describe',
                        onUpdateValue: (val: any) => {
                            row.describe = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Must',
        key: 'must',
        align: 'center',
        width: 60,
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input',
                },
                [
                    h(ACheckbox, {
                        value: row.must,
                        onUpdateValue: (val: any) => {
                            row.must = val
                        }
                    })
                ]
            )
        }
    },
    {
        key: 'title',
        align: 'center',
        width: 34,
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input',
                },
                [
                    h(NButton, {
                        size: 'small',
                        quaternary: true,
                        onClick: () => {
                            if (data.value.request.tab === 'param') {
                                data.value.request.query.splice(index, 1)
                            } else if (data.value.request.tab === 'header') {
                                data.value.request.headers.splice(index, 1)
                            }
                        }
                    }, {
                        default: () => h(
                            NIcon,
                            {},
                            {
                                default: () => h(Remove)
                            }
                        )
                    })
                ]
            )
        },
        title() {
            return h('div',
                {
                    class: 'input',
                },
                [
                    h(NButton, {
                        size: 'small',
                        quaternary: true,
                        onClick: () => {
                            if (data.value.request.tab === 'param') {
                                data.value.request.query.push({
                                    key: window.crypto.randomUUID(),
                                    checked: true,
                                    field: '',
                                    value: '',
                                    describe: '',
                                    default: '',
                                    must: true
                                })
                            } else if (data.value.request.tab === 'header') {
                                data.value.request.headers.push({
                                    key: window.crypto.randomUUID(),
                                    checked: true,
                                    field: '',
                                    value: '',
                                    describe: '',
                                    default: '',
                                    must: true
                                })
                            }
                        }
                    }, {
                        default: () => h(
                            NIcon,
                            {},
                            {
                                default: () => h(Add)
                            }
                        )
                    })
                ]
            )
        }
    }
])

const columnsForm = ref<DataTableColumns<any>>([
    {
        type: 'selection',
    },
    {
        title: 'Key',
        key: 'key',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.field,
                        placeholder: 'Key',
                        onUpdateValue: (val: any) => {
                            row.field = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Value',
        key: 'value',
        minWidth: 300,
        render(row: any, index: number) {
            let node
            if (row.type == 'text') {
                node = h(AInput, {
                    value: row.value,
                    placeholder: 'Value',
                    onUpdateValue: (val: any) => {
                        row.value = val
                    }
                })
            } else if (row.type == 'file') {
                node = h(NUpload, {
                    multiple: true,
                    size: 'small',
                    defaultUpload: false,
                    showFileList: false,
                    onUpdateFileList: (val: any) => {
                        row.file = val
                    }
                }, {
                    default: () => h(NPopover, {
                    }, {
                        trigger: () => h(
                            NButton,
                            {
                                size: 'small',
                                tertiary: true,
                            },
                            {
                                default: () => {
                                    if (row.file) {
                                        return row.file[0].name
                                    }
                                    return 'Upload'
                                }
                            }
                        ),
                        default: () => {
                            if (row.file) {
                                let filelist = row.file.map((item: any) => {
                                    return h('div', {}, item.file.name)
                                })
                                return filelist
                            }
                            return '[no file]'
                        }
                    })
                })
            }
            return h('div',
                {
                    class: 'input',
                    style: {
                        display: 'flex'
                    }
                },
                [
                    h(NSelect, {
                        value: row.type,
                        size: 'small',
                        style: {
                            width: '100px'
                        },
                        options: [{
                            label: "Text",
                            value: 'text'
                        }, {
                            label: "File",
                            value: 'file'
                        }],
                        onUpdateValue: (val: any) => {
                            row.type = val
                        }
                    }),
                    node
                ]
            )
        }
    },
    {
        title: 'Default',
        key: 'default',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.default,
                        placeholder: 'Default',
                        onUpdateValue: (val: any) => {
                            row.default = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Describe',
        key: 'describe',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.describe,
                        placeholder: 'Describe',
                        onUpdateValue: (val: any) => {
                            row.describe = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Must',
        key: 'must',
        align: 'center',
        width: 60,
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input',
                },
                [
                    h(ACheckbox, {
                        value: row.must,
                        onUpdateValue: (val: any) => {
                            row.must = val
                        }
                    })
                ]
            )
        }
    },
    {
        key: 'title',
        align: 'center',
        width: 34,
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input',
                },
                [
                    h(NButton, {
                        size: 'small',
                        quaternary: true,
                        onClick: () => {
                            data.value.request.body.form.splice(index, 1)
                        }
                    }, {
                        default: () => h(
                            NIcon,
                            {},
                            {
                                default: () => h(Remove)
                            }
                        )
                    })
                ]
            )
        },
        title() {
            return h('div',
                {
                    class: 'input',
                },
                [
                    h(NButton, {
                        size: 'small',
                        quaternary: true,
                        onClick: () => {
                            let key = window.crypto.randomUUID()
                            data.value.request.body.form.push({
                                key: key,
                                checked: true,
                                field: '',
                                value: '',
                                type: 'text',
                                file: null,
                                describe: '',
                                default: '',
                                must: true,
                            })
                            data.value.request.body.form_keys.push(key)
                        }
                    }, {
                        default: () => h(
                            NIcon,
                            {},
                            {
                                default: () => h(Add)
                            }
                        )
                    })
                ]
            )
        }
    }
])
const columnsResponseHeaders = ref<DataTableColumns<any>>([
    {
        title: 'Key',
        key: 'field',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.field,
                        placeholder: 'Key',
                        clearable: false,
                        onUpdateValue: (val: any) => {
                            row.field = val
                        }
                    })
                ]
            )
        }
    },
    {
        title: 'Value',
        key: 'value',
        render(row: any, index: number) {
            return h('div',
                {
                    class: 'input'
                },
                [
                    h(AInput, {
                        value: row.value,
                        placeholder: 'Value',
                        clearable: false,
                        onUpdateValue: (val: any) => {
                            row.field = val
                        }
                    })
                ]
            )
        }
    }
])

const formatDatetime = (time: number) => {
    if (time) {
        let date = new Date(time)
        return date.toLocaleString()
    }
    return 'not request'
}

const handleChangeType = (_: string) => {
    requestRef.value.setValue(data.value.request.body.json || '')
}
</script>

<template>
    <div class="content">
        <div class="title">
            <n-input-group>
                <n-input disabled v-model:value="data.label" placeholder="Label" />
                <n-input disabled v-model:value="data.request.describe" placeholder="Describe" />
                <n-popselect v-model:value="env" @update:value="handleChangeEnv" :options="environs" trigger="click">
                    <n-button @click="handleEnvChange">{{ env || '(No Env)' }}</n-button>
                </n-popselect>
                <!-- <n-button @click="handleSync" :loading="loading">
                        <template #icon>
                            <n-icon>
                                <CloudUpload />
                            </n-icon>
                        </template>
                    </n-button> -->
            </n-input-group>
            <n-input-group>
                <n-select v-model:value="data.request.method" :options="options" style="width: 150px" />
                <n-input v-model:value="href" placeholder="Location" />
                <n-button @click="handleSend" :loading="showLoading">
                    <template #icon>
                        <n-icon>
                            <Send />
                        </n-icon>
                    </template>
                </n-button>
            </n-input-group>
        </div>
        <div class="request" :style="`height: ${height - 68}px`">
            <n-tabs style="top: 0; bottom: 0" v-model:value="data.request.tab">
                <n-tab-pane name="header" display-directive="show">
                    <template #tab>
                        <div style="padding: 0 10px">
                            <span>Header</span>
                        </div>
                    </template>
                    <n-data-table v-if="data.request?.headers" size="small" :columns="columns"
                        v-model:checked-row-keys="data.request.headers_keys" :data="data.request.headers"
                        :single-line="false" :bordered="false" />
                </n-tab-pane>
                <n-tab-pane name="param" display-directive="show">
                    <template #tab>
                        <div style="padding: 0 10px">
                            <span>Param</span>
                        </div>
                    </template>
                    <n-data-table v-if="data.request?.query" size="small" :columns="columns"
                        v-model:checked-row-keys="data.request.query_keys" :data="data.request.query"
                        :single-line="false" :bordered="false" />
                </n-tab-pane>
                <n-tab-pane name="body" display-directive="show">
                    <template #tab>
                        <div style="padding: 0 10px">
                            <span>Body</span>
                        </div>
                    </template>
                    <n-radio-group v-model:value="data.request.body.type" name="radiogroup"
                        @update:value="handleChangeType">
                        <n-space>
                            <n-radio v-for="song in [
                                { label: 'None', value: 'none' },
                                { label: 'JSON', value: 'json' },
                                { label: 'Form', value: 'form' },
                                { label: 'Text', value: 'text' },
                                { label: 'XML', value: 'xml' },
                                { label: 'Binary', value: 'binary' },
                            ]" :key="song.value" :value="song.value">
                                {{ song.label }}
                            </n-radio>
                        </n-space>
                    </n-radio-group>
                    <div v-show="data.request.body.type == 'none'"></div>
                    <div v-show="data.request.body.type == 'json'"
                        style="position: absolute; top: 30px; left: 0; bottom: 0; right: 0">
                        <Editor ref="requestRef" @change="(val: any) => data.request.body.json = val"
                            :value="data.request.body.json" />
                    </div>
                    <n-layout v-show="data.request.body.type == 'form'" position="absolute" style="top: 30px; bottom: 0"
                        :native-scrollbar="false">
                        <n-data-table v-if="data.request?.query" size="small" :columns="columnsForm"
                            v-model:checked-row-keys="data.request.body.form_keys" :data="data.request.body.form"
                            :single-line="false" :bordered="false" />
                    </n-layout>
                </n-tab-pane>
            </n-tabs>
        </div>
        <div class="divider" ref="dividerRef" @mousedown="handleMouseDown" @mouseup="handleMouseUp"
            :style="`top: ${height}px`">
            <n-divider />
        </div>
        <div class="response" :style="`top: ${height + 4}px`">
            <n-spin :show="showLoading">
                <n-layout position="absolute" style="top: 0; bottom: 0" :native-scrollbar="false">
                    <n-tabs style="top: 0; bottom: 0" v-model:value="data.response.tab">
                        <n-tab-pane name="header" display-directive="show">
                            <template #tab>
                                <div style="padding: 0 10px">
                                    <span>Header</span>
                                </div>
                            </template>
                            <n-layout position="absolute" style="top: 0; bottom: 0" :native-scrollbar="false">
                                <n-data-table v-if="data.response?.headers" size="small"
                                    :columns="columnsResponseHeaders" :data="data.response.headers" :single-line="false"
                                    :bordered="false" />
                            </n-layout>
                        </n-tab-pane>
                        <n-tab-pane name="body" display-directive="show">
                            <template #tab>
                                <div style="padding: 0 10px">
                                    <span>Body</span>
                                </div>
                            </template>
                            <n-radio-group v-model:value="data.response.body.type"
                                style="position: absolute; top: 6px; left: 4px" name="radiogroup"
                                @update:value="handleChangeType">
                                <n-space>
                                    <n-radio v-for="song in [
                                        { label: 'Pretty', value: 'pretty' },
                                        { label: 'Raw', value: 'raw' },
                                        { label: 'Preview', value: 'preview' },
                                    ]" :key="song.value" :value="song.value">
                                        {{ song.label }}
                                    </n-radio>
                                </n-space>
                            </n-radio-group>
                            <div v-show="data.response.body.type == 'pretty'"
                                style="position: absolute; top: 30px; left: 0; bottom: 0; right: 0">
                                <Editor ref="responseRef" @change="(val: string) => data.response.body.json = val"
                                    :value="data.response.body.json" />
                            </div>
                            <div v-show="data.response.body.type == 'raw'"
                                style="position: absolute; top: 30px; left: 0; bottom: 0; right: 0">
                                <pre>{{ data.response.body.text }}</pre>
                            </div>
                            <div v-show="data.response.body.type == 'preview'"
                                style="position: absolute; top: 30px; left: 0; bottom: 0; right: 0">
                                <pre>{{ data.response.body.html }}</pre>
                            </div>
                        </n-tab-pane>
                        <template #suffix>
                            <div style="padding: 0 10px">
                                <n-tag type="success" v-if="data.response.status >= 200 && data.response.status < 300"
                                    size="small" style="margin-right: 10px">
                                    {{ data.response.status }}&nbsp;{{ data.response.statusText }}
                                </n-tag>
                                <n-tag type="info" v-else-if="data.response.status >= 300 && data.response.status < 400"
                                    size="small" style="margin-right: 10px">
                                    {{ data.response.status }}&nbsp;{{ data.response.statusText }}
                                </n-tag>
                                <n-tag type="warning"
                                    v-else-if="data.response.status >= 400 && data.response.status < 500" size="small"
                                    style="margin-right: 10px">
                                    {{ data.response.status }}&nbsp;{{ data.response.statusText }}
                                </n-tag>
                                <n-tag type="error" v-else-if="data.response.status >= 500" size="small"
                                    style="margin-right: 10px">
                                    {{ data.response.status }}&nbsp;{{ data.response.statusText }}
                                </n-tag>
                                <n-tag v-else size="small" style="margin-right: 10px">
                                    {{ data.response.status }}&nbsp;{{ data.response.statusText }}
                                </n-tag>
                                <span style="font-size: 12px;">{{ formatDatetime(data.response.datetime) }}</span>
                            </div>
                        </template>
                    </n-tabs>
                </n-layout>
            </n-spin>
        </div>
    </div>
</template>
  
<style>
.content {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 51px;
    overflow: hidden;
}

.title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 68px;
}

.request {
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
}

.divider {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
    background: #888;
}

.response {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
  