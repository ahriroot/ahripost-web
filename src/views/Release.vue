<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { NLayout, NLayoutHeader, NCollapse, NCollapseItem, NIcon, NButton, useMessage } from 'naive-ui'
import { ReturnDownBack, ApertureOutline } from '@vicons/ionicons5'
import useCommonStore from '@/store/common'


window.$message = useMessage()

const router = useRouter()
const commonStore = useCommonStore()

const versions = ref(['0.1.0'])
const releases = shallowRef<any[]>([
    {
        title: 'V0.1.0',
        version: '0.1.0',
        date: '2022-11-01',
        paths: [
            {
                name: 'AhriPost_0.1.0_x64_zh-CN.msi',
                href: 'https://installer.service.ahriknow.com/ahripost/rust/releases/v0.1.0/msi/AhriPost_0.1.0_x64_zh-CN.msi',
            },
            {
                name: 'AhriPost_0.1.0_x64_zh-CN.msi.zip',
                href: 'https://installer.service.ahriknow.com/ahripost/rust/releases/v0.1.0/msi/AhriPost_0.1.0_x64_zh-CN.msi.zip',
            },
            {
                name: 'SHA256 File',
                href: 'https://installer.service.ahriknow.com/ahripost/rust/releases/v0.1.0/msi/AhriPost_0.1.0_x64_zh-CN.msi.sha256',
            }
        ]
    }
])

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
    <n-layout class="release">
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
        <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider content-style="padding: 24px">
            <n-collapse :default-expanded-names="versions">
                <n-collapse-item v-for="i in releases" :title="`${i.title} ==> ${i.date}`" :name="i.version">
                    <div class="paths">
                        <a v-for="j in i.paths" :href="j.href" target="_blank">{{ j.name }}</a>
                    </div>
                </n-collapse-item>
            </n-collapse>
        </n-layout>
    </n-layout>
</template>

<style scoped>
.release {
    width: 100%;
    height: 100%;
}

.paths {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>
