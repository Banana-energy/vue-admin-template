export const state = reactive({
  loading: false,
},)

export function usePageLoading() {
  const loadStart = () => {
    state.loading = true
  }

  const loadDone = () => {
    state.loading = false
  }

  const getLoading = () => {
    return state.loading
  }

  return {
    loadStart,
    loadDone,
    getLoading,
  }
}
