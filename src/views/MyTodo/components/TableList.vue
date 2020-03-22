<template>
  <main>
    <el-table :height="tableHeight" size="mini" border>
      <el-table-column
        v-for="(column, columnIndex) of checkRoute"
        :key="columnIndex"
        :label="column.label"
        :align="column.align"
      ></el-table-column>
    </el-table>
  </main>
</template>

<script>
export default {
  data () {
    return {
      tableHeight: window.innerHeight - this.$parent.$refs.searchBar.$el.offsetHeight - 282,
      todoColumns: [
        {
          prop: '',
          label: '流水号',
          align: 'center'
        },
        {
          prop: '',
          label: '主题',
          align: 'center'
        },
        {
          prop: '',
          label: '流程名称',
          align: 'center'
        },
        {
          prop: '',
          label: '当前节点',
          align: 'center'
        },
        {
          prop: '',
          label: '申请人',
          align: 'center'
        },
        {
          prop: '',
          label: '申请时间',
          align: 'center'
        },
        {
          prop: '',
          label: '流程图',
          align: 'center'
        }
      ],
      doneColumns: [
        {
          prop: '',
          label: '流水号',
          align: 'center'
        },
        {
          prop: '',
          label: '主题',
          align: 'center'
        },
        {
          prop: '',
          label: '流程名称',
          align: 'center'
        },
        {
          prop: '',
          label: '操作节点',
          align: 'center'
        },
        {
          prop: '',
          label: '申请人',
          align: 'center'
        },
        {
          prop: '',
          label: '操作时间',
          align: 'center'
        },
        {
          prop: '',
          label: '操作结果',
          align: 'center'
        },
        {
          prop: '',
          label: '流程图',
          align: 'center'
        }
      ],
      requestColumns: [
        {
          prop: '',
          label: '流水号',
          align: 'center'
        },
        {
          prop: '',
          label: '主题',
          align: 'center'
        },
        {
          prop: '',
          label: '流程名称',
          align: 'center'
        },
        {
          prop: '',
          label: '当前节点',
          align: 'center'
        },
        {
          prop: '',
          label: '状态',
          align: 'center'
        },
        {
          prop: '',
          label: '申请时间',
          align: 'center'
        },
        {
          prop: '',
          label: '流程图',
          align: 'center'
        },
        {
          prop: '',
          label: '操作',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    checkRoute () {
      const routeName = this.$route.name
      switch (routeName) {
        case 'my-todo':
          return this.todoColumns
        case 'my-proxy':
          return []
        case 'my-done':
          return this.doneColumns
        case 'my-request':
          return this.requestColumns
        default:
          return []
      }
    }
  }
}
</script>

<style scoped>
  main {
    margin-bottom: 10px;
  }
</style>
