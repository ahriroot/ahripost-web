import { defineStore } from 'pinia'

const useCommonStore = defineStore({
    id: 'common',
    state: () => {
        return {
            theme: 'dark',
            countLoading: 0
        }
    },
    actions: {
        setTheme(theme: string) {
            localStorage.setItem('theme', theme)
            this.theme = theme
        },
        addLoading() {
            this.countLoading++
            return this.countLoading
        },
        reduceLoading() {
            this.countLoading--
            return this.countLoading
        }
    }
})

export default useCommonStore
