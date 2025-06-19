import { ref } from 'vue'

const isActive = ref(false)
const message = ref('')
const color = ref<'success' | 'error' | 'info' | 'warning'>('info')
const timeout = ref(3000)

export function useNotifier() {
  const notify = (options: {
    message: string
    color?: 'success' | 'error' | 'info' | 'warning'
    timeout?: number
  }) => {
    message.value = options.message
    color.value = options.color || 'info'
    timeout.value = options.timeout ?? 3000
    isActive.value = true
  }

  return {
    isActive,
    message,
    color,
    timeout,
    notify,
  }
}
