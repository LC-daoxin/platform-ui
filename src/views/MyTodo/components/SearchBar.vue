<template>
  <header>
    <div
      v-for="(item, index) of checkRoute"
      :key="index"
      class="search-item"
    >
      <p>{{ item.label }}</p>
      <el-input v-if="item.type==='input'" v-model="item.value" size="mini"></el-input>
      <el-select v-else-if="item.type==='select'" v-model="item.value" size="mini"></el-select>
      <el-date-picker
        v-if="item.type==='date'"
        v-model="item.value"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small">
      </el-date-picker>
    </div>
    <el-button type="primary" size="mini">搜索</el-button>
  </header>
</template>

<script>
export default {
  data () {
    return {
      toDoItems: [
        {
          label: '流水号',
          type: 'input',
          value: ''
        },
        {
          label: '申请人',
          type: 'input',
          value: ''
        },
        {
          label: '主题',
          type: 'input',
          value: ''
        },
        {
          label: 'SAP单号',
          type: 'input',
          value: ''
        },
        {
          label: '状态',
          type: 'select',
          value: ''
        },
        {
          label: '申请时间',
          type: 'date',
          value: ''
        },
        {
          label: '流程分组',
          type: 'select',
          value: ''
        },
        {
          label: '流程类型',
          type: 'select',
          value: ''
        },
        {
          label: '流程名称',
          type: 'select',
          value: ''
        }
      ],
      proxyItems: [
        {
          label: '被代理人',
          type: 'select',
          value: ''
        },
        {
          label: '申请人',
          type: 'input',
          value: ''
        },
        {
          label: '主题',
          type: 'input',
          value: ''
        },
        {
          label: '主题',
          type: 'input',
          value: ''
        },
        {
          label: '流水号',
          type: 'input',
          value: ''
        },
        {
          label: 'SAP单据号',
          type: 'input',
          value: ''
        },
        {
          label: '申请时间',
          type: 'date',
          value: ''
        },
        {
          label: '流程分组',
          type: 'select',
          value: ''
        },
        {
          label: '流程类型',
          type: 'select',
          value: ''
        },
        {
          label: '流程名称',
          type: 'select',
          value: ''
        }
      ],
      doneItems: [
        {
          label: '流水号',
          type: 'input',
          value: ''
        },
        {
          label: '申请人',
          type: 'input',
          value: ''
        },
        {
          label: '主题',
          type: 'input',
          value: ''
        },
        {
          label: 'SAP单号',
          type: 'input',
          value: ''
        },
        {
          label: '状态',
          type: 'select',
          value: ''
        },
        {
          label: '操作时间',
          type: 'date',
          value: ''
        },
        {
          label: '流程分组',
          type: 'select',
          value: ''
        },
        {
          label: '流程类型',
          type: 'select',
          value: ''
        },
        {
          label: '流程名称',
          type: 'select',
          value: ''
        }
      ],
      requestItems: [
        {
          label: '流水号',
          type: 'input',
          value: ''
        },
        {
          label: '主题',
          type: 'input',
          value: ''
        },
        {
          label: 'SAP单号',
          type: 'input',
          value: ''
        },
        {
          label: '状态',
          type: 'select',
          value: ''
        },
        {
          label: '申请时间',
          type: 'date',
          value: ''
        },
        {
          label: '流程分组',
          type: 'select',
          value: ''
        },
        {
          label: '流程类型',
          type: 'select',
          value: ''
        },
        {
          label: '流程名称',
          type: 'select',
          value: ''
        }
      ]
    }
  },
  computed: {
    checkRoute () {
      const routeName = this.$route.name
      switch (routeName) {
        case 'my-todo':
          return this.toDoItems
        case 'my-proxy':
          return this.proxyItems
        case 'my-done':
          return this.doneItems
        case 'my-request':
          return this.requestItems
        default:
          return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .search-item {
      display: flex;
      align-items: center;
      margin: 0 10px 10px 0;

      p {
        font-size: 12px;
        white-space: nowrap;
        margin: 0 10px 0 0;
      }
    }

    .el-button {
      margin-bottom: 10px;
    }
  }
</style>
