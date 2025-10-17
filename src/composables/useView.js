import { ref } from 'vue'

export function useView() {
  const view = ref('home')
  const error = ref('')
  const saveStatus = ref('')

  function goToProfile() {
    error.value = ''
    saveStatus.value = ''
    view.value = 'profile'
  }

  function backHome() {
    error.value = ''
    saveStatus.value = ''
    view.value = 'home'
  }

  return {
    view,
    error,
    saveStatus,
    goToProfile,
    backHome
  }
}