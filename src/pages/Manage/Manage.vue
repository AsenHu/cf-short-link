<script setup lang="ts">
import CreateDialogComponent from '@/components/CreateDialog.vue'
import { ref } from 'vue'

defineOptions({
  name: 'ManagePage',
})

const createDialogVisible = ref(false)
</script>

<template>
  <a-space direction="vertical">
    <a-card title="Create" style="width: 300px">
      <!-- <template #extra><a href="#">more</a></template> -->
      <p>Create a short link.</p>
      <p>Shorten a URL.</p>
      <a-button type="primary" @click="createDialogVisible = true">
        Create
      </a-button>
      <create-dialog-component v-model:visible="createDialogVisible" />
    </a-card>
  </a-space>
</template>
