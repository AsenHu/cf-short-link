import { useMountComponent } from '@/hooks/useMountComponent'

import CreateLinkDialog from './CreateLinkDialog.vue'

export async function useCreateLinkDialog() {
  return await useMountComponent().mount<null>(CreateLinkDialog)
}
