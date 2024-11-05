<script setup lang="ts">
import { reactive } from 'vue'
import { useTokenStore } from '@/stores/token'

import { message } from 'ant-design-vue'
import router from '@/router'

defineOptions({
  name: 'AuthPage',
})

interface FormState {
  token: string
}

const formState = reactive<FormState>({
  token: '',
})

const tokenStore = useTokenStore()

const onFinish = (values: FormState) => {
  tokenStore.updateToken(values.token)
  message.success('Success to update token.')
  router.push({ name: 'Home' })
}
</script>

<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
  >
    <a-form-item
      label="Token"
      name="token"
      :rules="[{ required: true, message: 'Please input your Token' }]"
    >
      <a-input-password v-model:value="formState.token" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
