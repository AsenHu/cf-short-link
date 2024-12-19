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
  getLinkList()
}

onMounted(() => {
  getLinkList()
})
</script>

<template>
  <div class="manage">
    <div class="create">
      <a-button type="primary" @click="handleCreateLink">
        Create a link
      </a-button>
    </div>

    <div class="table">
      <a-table
        :dataSource="linkList"
        :columns="columns"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.manage {
  display: flex;
  flex-direction: column;

  .table {
    margin-top: 20px;
    max-width: 100%;
    height: 300px;
  }
}
</style>
