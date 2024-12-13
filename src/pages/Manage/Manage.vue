<script setup lang="ts">
import { useCreateLinkDialog } from '@/components/fc/index'

defineOptions({
  name: 'ManagePage',
})

const handleCreateLink = async () => {
  await useCreateLinkDialog()
}
</script>

<template>
  <a-space direction="vertical">
    <a-card title="Create" style="width: 300px">
      <!-- <template #extra><a href="#">more</a></template> -->
      <p>Create a short link.</p>
      <p>Shorten a URL.</p>
      <a-button type="primary" @click="handleCreateLink"> Create </a-button>
    </a-card>
  </a-space>
</template>
