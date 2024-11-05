<script setup lang="ts">
import { ref, watch, defineEmits, computed, reactive } from 'vue'
import { addShortLink } from '@/apis/index'
import { message } from 'ant-design-vue'
import type { shortLinkAdd } from '@/types/index'
import type { Dayjs } from 'dayjs'

defineOptions({
  name: 'CreateDialogComponent',
})

const prop = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['update:visible'])

const isOpen = ref(prop.visible)
const disabled = ref(false)
const resultDialogOpen = ref(false)
const resultLink = ref('test')

watch(
  () => prop.visible,
  newVal => {
    isOpen.value = newVal
  },
)

const expTimes = ref<{
  date: Dayjs | null
  time: Dayjs | null
}>({
  date: null,
  time: null,
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

const formState = reactive<shortLinkAdd>({
  url: '',
  length: 6,
  number: true,
  capital: true,
  lowercase: true,
  expiration: timeValue.value,
  expirationTtl: null,
})

const onFinish = async (values: shortLinkAdd) => {
  disabled.value = true
  const { data: result } = await addShortLink(values)
  disabled.value = false
  if (!result.ok) return message.error(result.msg)
  message.success(result.msg)
  formState.url = ''
  formState.length = 6
  formState.number = true
  formState.capital = true
  formState.lowercase = true
  formState.expiration = timeValue.value
  formState.expirationTtl = null
  resultLink.value = result.data.short
  emit('update:visible', false)
}
</script>

<template>
  <a-modal
    class="modal"
    width="80%"
    v-model:open="isOpen"
    title="Create Link"
    :footer="null"
    @cancel="emit('update:visible', false)"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
      :disabled="disabled"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item
        label="Url"
        name="url"
        :rules="[{ required: true, message: 'URL is required' }]"
      >
        <a-input v-model:value="formState.url" />
      </a-form-item>

      <a-form-item label="Length" name="length">
        <a-input-number v-model:value="formState.length" />
      </a-form-item>

      <a-form-item label="Number" name="number">
        <a-checkbox v-model:checked="formState.number" />
      </a-form-item>

      <a-form-item label="Capital" name="capital">
        <a-checkbox v-model:checked="formState.capital" />
      </a-form-item>

      <a-form-item label="Lowercase" name="lowercase">
        <a-checkbox v-model:checked="formState.lowercase" />
      </a-form-item>

      <a-form-item label="Expiration Date" name="expirationDate">
        <a-date-picker v-model:value="expTimes.date" />
      </a-form-item>

      <a-form-item label="Expiration Time" name="expirationTime">
        <a-time-picker v-model:value="expTimes.time" />
      </a-form-item>

      <a-form-item label="Expiration TTL" name="expirationTtl">
        <a-input-number
          v-model:value="formState.expirationTtl"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal v-model:open="resultDialogOpen" title="Success">
    <a-typography-paragraph :copyable="{ tooltip: false }">
      {{ resultLink }}
    </a-typography-paragraph>
  </a-modal>
</template>

<style scoped lang="less"></style>
