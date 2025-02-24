import { useMountComponent } from '@/hooks/useMountComponent'

import CreateLinkDialog from './CreateLinkDialog.vue'
import UpdateLinkDialog from './EditLinkDialog.vue'

export async function useCreateLinkDialog() {
    return await useMountComponent().mount<null>(CreateLinkDialog)
}

export async function useUpdateLinkDialog(
    short: string,
    url: string,
    expiration: number | null
) {
    return await useMountComponent({
        short,
        url,
        expiration
    }).mount<null>(UpdateLinkDialog)
}
