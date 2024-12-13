<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import router from './router'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

import { useNavStore } from '@/stores/nav'

defineOptions({
  name: 'AppComponent',
})

const selectedKeys = ref<string[]>()
const collapsed = ref<boolean>(false)
const navStore = useNavStore()

onMounted(() => {
  watch(
    () => router.currentRoute.value.name,
    name => {
      selectedKeys.value = [name?.toString() || '']
    },
    { immediate: true },
  )
})
</script>

<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <h1>CF Short Link</h1>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item
          v-for="item in navStore.navList"
          :key="item.key"
          @click="
            router.push({
              name: item.key,
            })
          "
        >
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0; padding-left: 25px">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
          height: '100%',
        }"
      >
        <div class="page-content">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.layout {
  height: 100vh;
  overflow: hidden;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    color: #fff;
    font-size: 18px;

    h1 {
      vertical-align: middle;
      margin: 0;
    }
  }
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

.page-content {
  overflow-y: auto;
  height: 100%;
}

::-webkit-scrollbar {
  height: 5px;
  width: 5px;
  padding: 0 5px;
}

::-webkit-scrollbar-thumb {
  background: #aaaa !important;
  box-shadow: none !important;
  border: none !important;
  border-radius: 10px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa !important;
}
</style>
