<!-- eslint-disable vue/no-reserved-props -->
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { updateLink, getFullLink } from '@/apis/index'
import { message, Modal } from 'ant-design-vue'
import type { shortLinkEdit } from '@/types/index'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

defineOptions({
    name: 'EditLinkDialogComponent'
})

const props = defineProps<{
    emitResult: () => void
    destroyComponent: () => void
    short: string
    url: string
    expiration: number | null
}>()

const isOpen = ref(true)
const disabled = ref(false)

const getUrlStatus = ref<boolean>(false)

const expTimes = ref<{
    date: Dayjs | null
    time: Dayjs | null
}>({
    date: null,
    time: null
})

const timeValue = computed(() => {
    if (expTimes.value.date && expTimes.value.time) {
        return expTimes.value.date
            .hour(expTimes.value.time.hour())
            .minute(expTimes.value.time.minute())
            .second(expTimes.value.time.second())
            .valueOf()
    }
    return null
})

const formState = reactive<shortLinkEdit>({
    url: props.url,
    expiration: props.expiration,
    short: props.short
})

const onFinish = async () => {
    if (!formState.url) return message.error('URL is required')
    if (timeValue.value) formState.expiration = timeValue.value

    disabled.value = true
    const { data: result } = await updateLink(formState)
    disabled.value = false
    if (result.ok !== true) return message.error('Failed to update link')
    Modal.success({
        title: 'Success',
        content: 'Link updated successfully',
        onOk: handleDialogClose
    })
}

const handleDialogClose = () => {
    isOpen.value = false
    props.emitResult()
    props.destroyComponent()
}

onMounted(async () => {
    if (props.expiration) {
        const parsedExpiration = dayjs.unix(props.expiration)
        expTimes.value.date = parsedExpiration.startOf('day')
        expTimes.value.time = parsedExpiration
    }

    if (!formState.url) {
        getUrlStatus.value = true
        formState.url = 'Fetching...'
        const { data: result } = await getFullLink(props.short)
        getUrlStatus.value = false
        if (result.ok !== true) {
            return message.error('Failed to fetch link')
        }
        formState.url = result?.data?.url || ''
    }
})
</script>

<template>
    <a-modal
        class="modal"
        width="80%"
        v-model:open="isOpen"
        title="Update Link"
        :footer="null"
        @cancel="props.destroyComponent()"
    >
        <a-form
            :model="formState"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            :disabled="disabled"
            autocomplete="off"
            @finish="onFinish"
        >
            <a-form-item label="Key" name="key">
                <a-input disabled v-model:value="formState.short" />
            </a-form-item>

            <a-form-item label="URL" name="url">
                <a-input :disabled="getUrlStatus" v-model:value="formState.url" />
            </a-form-item>

            <a-form-item label="Expiration Date" name="expirationDate">
                <a-date-picker v-model:value="expTimes.date" />
            </a-form-item>

            <a-form-item label="Expiration Time" name="expirationTime">
                <a-time-picker v-model:value="expTimes.time" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
                <a-button type="primary" html-type="submit">Submit</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="less"></style>
