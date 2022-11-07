<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import useCommonStore from '@/store/common'
import { ApertureOutline, AlbumsSharp, AlbumsOutline, CloudDownload } from '@vicons/ionicons5'
import { NLayout, NButton, NIcon, useMessage } from 'naive-ui'
import RenderVue from '@/components/Render.vue'
import md from '../../README.md?raw'


window.$message = useMessage()
const router = useRouter()
const store = useCommonStore()
const showDoc = ref(true)

const handleSetTheme = () => {
    console.log(md)
    if (store.theme === 'dark') {
        store.setTheme('light')
    } else {
        store.setTheme('dark')
    }
    showDoc.value = false
    nextTick(() => {
        showDoc.value = true
    })
}
</script>

<template>
    <n-layout class="index" style="height: 100%">
        <div class="btn">
            <n-button quaternary circle title="主题" @click="handleSetTheme">
                <template #icon>
                    <n-icon>
                        <ApertureOutline />
                    </n-icon>
                </template>
            </n-button>
            <n-button quaternary circle title="主题" @click="router.push({ name: 'Release' })">
                <template #icon>
                    <n-icon>
                        <CloudDownload />
                    </n-icon>
                </template>
            </n-button>
            <n-button quaternary circle title="文档管理" @click="router.push({ name: 'AdminProject' })">
                <template #icon>
                    <n-icon>
                        <AlbumsSharp />
                    </n-icon>
                </template>
            </n-button>
            <n-button quaternary circle title="公开文档" @click="router.push({ name: 'PublicProject' })">
                <template #icon>
                    <n-icon>
                        <AlbumsOutline />
                    </n-icon>
                </template>
            </n-button>
        </div>
        <div class="content">
            <RenderVue v-if="showDoc" :value="md" :theme="store.theme"></RenderVue>
            <br>
            <br>
            <br>
            <a href="https://beian.miit.gov.cn/" target="_blank" style="color: dimgray;">吉ICP备19000749号</a>
        </div>
    </n-layout>
</template>

<style scoped>
.index {
    width: 100%;
    height: 100%;
}

.btn {
    position: fixed;
    top: 4px;
    right: 10px;
}

.content {
    max-width: 800px;
    margin: 20px auto;
}
</style>
