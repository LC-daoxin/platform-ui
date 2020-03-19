<template>
  <div>
    <el-table size="mini" :data="tableData" border>
      <el-table-column
        prop="name"
        label="功能名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="value"
        label="功能值"
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template>
          <el-button type="primary" size="mini">编辑</el-button>
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
          name: 'AllowApproverCallBack',
          value: 'False'
        },
        {
          name: 'AllowRescideWhenApproved',
          value: 'False'
        },
        {
          name: 'ApplicantCallback',
          value: 'False'
        },
        {
          name: 'ApproveLinkage',
          value: ''
        },
        {
          name: 'CancelOperation',
          value: ''
        },
        {
          name: 'CanSetApprover',
          value: 'False'
        },
        {
          name: 'CreateLinkage',
          value: ''
        },
        {
          name: 'DiagramLinkage',
          value: ''
        },
        {
          name: 'EntryLinkage',
          value: ''
        },
        {
          name: 'HelpLinkage',
          value: ''
        },
        {
          name: 'PrintLinkage',
          value: ''
        },
        {
          name: 'RescindToApplicant',
          value: ''
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