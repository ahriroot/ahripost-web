import { defineStore } from 'pinia'

const useAuthStore = defineStore({
    id: 'auth',
    state: () => {
        return {
            token: 'TOKEN'
        }
    },
    actions: {
        async updateToken(token: string) {
            localStorage.setItem('token', token)
            this.token = token
        }
    }
})

export default useAuthStore
