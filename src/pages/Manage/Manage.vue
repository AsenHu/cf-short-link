<script setup lang="ts">
import { onMounted } from 'vue'
import { useCreateLinkDialog, useUpdateLinkDialog } from '@/components/fc/index'
import { useManage } from '@/hooks/useManage'

defineOptions({
    name: 'ManagePage'
})

const { getLinkList, linkList, columns, currentPage, pageSize, total, searchTerm } =
    useManage()

const handleCreateLink = async () => {
    await useCreateLinkDialog()
    getLinkList()
}

const handleChangePage = (page: number, pageSizeValue: number) => {
    currentPage.value = page
    pageSize.value = pageSizeValue
}

onMounted(() => {
    getLinkList()
})
</script>

<template>
    <div class="manage">
        <div class="create">
            <a-button type="primary" @click="handleCreateLink"> Create a link </a-button>
        </div>

        <div class="search">
            <a-input placeholder="Filter" v-model:value="searchTerm" />
        </div>

        <div class="table">
            <a-table
                :dataSource="linkList"
                :columns="columns"
                :pagination="{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    onChange: handleChangePage
                }"
            >
                <!-- eslint-disable-next-line vue/no-unused-vars -->
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <a-button
                            type="link"
                            @click="
                                useUpdateLinkDialog(
                                    record.key,
                                    record.url,
                                    record.expiration
                                )
                            "
                        >
                            Details
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<style scoped lang="less">
.manage {
    display: flex;
    flex-direction: column;

    .search {
        margin-top: 20px;
    }

    .table {
        margin-top: 20px;
        max-width: 100%;
        height: 300px;
    }
}
</style>
