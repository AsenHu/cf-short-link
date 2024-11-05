<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import router from './router'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

import { nav } from '@/utils/nav'

defineOptions({
  name: 'AppComponent',
})

const selectedKeys = ref<string[]>()
const collapsed = ref<boolean>(false)

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
          v-for="item in nav"
          :key="item.key"
          @click="
            router.push({
              name: item.key,
            })
          "
        >
          <component :is="item.icon" />
          <span>{{ item.lable }}</span>
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
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.layout {
  height: 100vh;

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
</style>
