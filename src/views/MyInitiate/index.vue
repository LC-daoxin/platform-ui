<template>
  <div class="dashboard-editor-container">
    <!-- accordion -->
    <el-collapse>
      <el-collapse-item v-for="(flow, flowIndex) of flows" :key="flowIndex" :name="flow.name">
        <template slot="title">
          <span class="title">{{ flow.name }}</span>
        </template>
        <main>
          <template v-for="(flowItem, flowItemIndex) of flow.children">
            <el-badge
              v-if="flowItem.num > 0"
              :key="flowItemIndex"
              :value="flowItem.num"
              class="item"
            >
              <el-button type="primary" size="mini" plain>{{ flowItem.name }}</el-button>
            </el-badge>
            <el-button
              v-else
              :key="flowItemIndex"
              :disabled="!flowItem.authority"
              type="info"
              size="mini"
              class="item"
              plain
            >{{ flowItem.name }}（无权限）</el-button>
          </template>
        </main>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flows: [
        {
          name: '测试流程',
          children: [
            {
              name: '设备维修审批流程',
              num: 4,
              authority: true
            }
          ]
        },
        {
          name: '质量流程',
          children: [
            {
              name: '申请单',
              num: 0,
              authority: false
            },
            {
              name: '入库通知单',
              num: 0,
              authority: false
            },
            {
              name: '配送计划单',
              num: 0,
              authority: false
            },
            {
              name: '油品出库单',
              num: 0,
              authority: false
            }
          ]
        },
        {
          name: '销售流程',
          children: [
            {
              name: '客户管理',
              num: 4,
              authority: true
            },
            {
              name: '移库',
              num: 2,
              authority: true
            },
            {
              name: '信用特批',
              num: 2,
              authority: true
            },
            {
              name: '提货管理',
              num: 3,
              authority: true
            },
            {
              name: '销售计划',
              num: 2,
              authority: true
            },
            {
              name: '销售合同',
              num: 0,
              authority: false
            },
            {
              name: '销售订单',
              num: 4,
              authority: false
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
  /* el-collapse-item__header */
  .dashboard-editor-container /deep/ .el-collapse-item__header {
    border-bottom: none;
  }
  .dashboard-editor-container /deep/ .el-collapse {
    border: none;
  }
  .title {
    font-size: 16px;
  }
  main {
    padding: 15px 10px 0;
    display: flex;
    flex-wrap: wrap;
  }
  main .item {
    margin: 0 20px 10px 0;
  }
</style>
