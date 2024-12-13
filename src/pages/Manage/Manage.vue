<script setup lang="ts">
import { onMounted } from 'vue'

import { useCreateLinkDialog } from '@/components/fc/index'
import { useManage } from '@/hooks/useManage'

defineOptions({
  name: 'ManagePage',
})

const { getLinkList, linkList, columns } = useManage()

const handleCreateLink = async () => {
  await useCreateLinkDialog()
}

onMounted(() => {
  getLinkList()
})
</script>

<template>
  <a-space direction="vertical">
    <a-card title="Create" style="width: 300px">
      <!-- <template #extra><a href="#">more</a></template> -->
      <p>Create a short link.</p>
      <p>Shorten a URL.</p>
      <a-button type="primary" @click="handleCreateLink"> Create </a-button>
    </a-card>
    {{ linkList }}

    <a-table :dataSource="linkList" :columns="columns" />
  </a-space>
</template>
