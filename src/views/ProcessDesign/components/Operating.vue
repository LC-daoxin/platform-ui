<template>
  <div>
    <el-table size="mini" :data="tableData" border>
      <el-table-column
        prop="name"
        label="操作名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="customName"
        label="自定义名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="启用状态"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="success" size="mini">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
      >
        <template>
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="primary" size="mini">配置邮件</el-button>
          <el-button type="danger" size="mini">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: 'Approve',
          customName: 'Approve',
          status: '可用'
        },
        {
          name: 'Decline',
          customName: 'Decline',
          status: '可用'
        },
        {
          name: 'Modify',
          customName: 'Modify',
          status: '可用'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
	::v-deep .el-button--mini {
		padding: 5px 8px;
		vertical-align: top;
	}
</style>