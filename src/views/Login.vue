<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAuthStore from '@/store/auth'
import { NLayout, NCard, NTabs, NTabPane, NForm, NFormItemRow, NInput, NButton, useMessage } from 'naive-ui'
import http from '@/net/http'
import { IResLogin } from '@/types/http/login'
import Base64 from '@/utils/ab'


window.$message = useMessage()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
    const data = await http.post<IResLogin>('/login', {
        username: username.value,
        password: password.value
    })
    authStore.updateToken(data.data.token)
    if (route.query.redirect) {
        let from = Base64.decode(route.query.redirect as string)
        console.log(from)
        // router.push({
        //     path: from
        // })
    }
}

onBeforeMount(async () => {
})
</script>

<template>
    <n-layout class="login" content-style="display: flex;justify-content: center;align-items: center;height: 100%;">
        <n-card title="Too Simple" style="width: 500px;">
            <n-tabs default-value="signin" size="large" justify-content="space-evenly">
                <n-tab-pane name="signin" tab="登录">
                    <n-form>
                        <n-form-item-row label="用户名">
                            <n-input v-model:value="username" />
                        </n-form-item-row>
                        <n-form-item-row label="密码">
                            <n-input v-model:value="password" />
                        </n-form-item-row>
                    </n-form>
                    <n-button type="primary" block secondary strong @click="handleLogin">
                        登录
                    </n-button>
                </n-tab-pane>
                <n-tab-pane name="signup" tab="注册">
                    <n-form>
                        <n-form-item-row label="用户名">
                            <n-input />
                        </n-form-item-row>
                        <n-form-item-row label="密码">
                            <n-input />
                        </n-form-item-row>
                        <n-form-item-row label="重复密码">
                            <n-input />
                        </n-form-item-row>
                    </n-form>
                    <n-button type="primary" disabled block secondary strong>
                        注册
                    </n-button>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </n-layout>
</template>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
