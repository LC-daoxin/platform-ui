<template>
  <el-dialog
    title="添加用户"
    :visible.sync="dialogAddUserVisible"
    @open="getldapUserInfo"
    :before-close='handleDialog'
    width="720px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="6">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addUsers()">批量添加</el-button>
        </el-col>
        <el-col :span="18">
          <el-row type="flex" :gutter="10" justify="end">
            <el-col :span="7">
              <el-select v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="搜索..." v-model="searchValue"  size="mini"/>
            </el-col>
            <el-col :span="4">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 用户table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="450px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column label="账号" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.sAMAccountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.mail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" align="center">
        <template slot-scope="scope">
          <div>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleTime(scope.row)">添加</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户table end -->
  </el-dialog>
</template>

<script>
export default {
  name: 'add-user',
  props: {
    dialogAddUserVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [{
        value: 'user',
        label: 'LDAP Users'
      }, {
        value: 'group',
        label: 'LDAP Groups'
      }, {
        value: 'organizationalUnit',
        label: 'LDAP OU'
      }],
      value: 'user',
      searchValue: '', // 搜索内容
      tableData: [],
      multipleSelection: [], // 多选内容
      loading: false
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'AddUser')
    },
    // 获取LDAP 用户列表
    getldapUserInfo (objectClass = 'user', queryName = '*') {
      this.loading = true
      this.axios.get(`/user/ldapUserSearch/${objectClass}/${queryName}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      console.log(data)
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.loading = false
      }
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 批量加载
    addUsers () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择用户！'
        })
      } else {
        this.$parent.handleTime(this.multipleSelection, 3)
      }
    },
    // 添加用户
    handleTime (row) {
      this.$parent.handleTime(row, 2)
    },
    // 搜索
    search () {
      if (this.searchValue === '') {
        this.getldapUserInfo(this.value, '*')
      } else {
        this.getldapUserInfo(this.value, this.searchValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
</style>
