<template>
  <div class="dashboard-editor-container">
    <div class="role">
      <!-- 控制栏 start -->
      <div class="bar">
        <el-row>
          <el-col :span="12">
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDialog('AddRole')">新增</el-button>
            <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
            <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="openDialog('sapRole')">同步</el-button>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-document" @click="openDialog('GroupRole')">关联</el-button>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search">高级搜索</el-button>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" :gutter="5" justify="end">
              <el-col :span="7">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input placeholder="角色名称、角色描述或Tcode" v-model="searchValue" size="mini"/>
              </el-col>
              <el-col :span="9">
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 控制栏 end -->
      <!-- 角色维护table start -->
      <el-table
        size="mini"
        :data="tableData"
        border
        highlight-current-row
        @row-dblclick="dblclick"
        class="table"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="35">
        </el-table-column>
        <el-table-column label="系统ID" min-width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-select @change="changeSYSID" v-model="scope.row.SYSID" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <span v-else>{{ scope.row.SYSTEMCODE }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色类型" min-width="70" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.ROLETYPENAME }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" min-width="110" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input v-model="scope.row.ROLENAME" class="edit-input" size="mini" />
            </template>
            <span v-else>{{ scope.row.ROLENAME }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色描述" min-width="110" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input v-model="scope.row.ROLEDESC" class="edit-input" size="mini" />
            </template>
            <span v-else>{{ scope.row.ROLEDESC }}</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单" min-width="65" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="RoleMenu(scope.row)">授权</el-button>
          </template>
        </el-table-column>
        <el-table-column label="授权" min-width="355" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-button
                type="success"
                size="mini"
                @click="confirmEdit(scope.row)"
              >
                保存
              </el-button>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="cancelEdit(scope.row)"
              >
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="primary" @click="RoleFlow(scope.row, 'START')">流程发起</el-button>
              <el-button size="mini" type="primary" @click="RoleFlow(scope.row, 'MANAGE')">流程管理</el-button>
              <el-button size="mini" type="primary" @click="GroupPermission(scope.row)">用户组授权</el-button>
              <el-button size="mini" type="primary" @click="category(scope.row)">审批策略授权</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="应用" min-width="90" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.edit"></template>
            <el-button v-else size="mini" type="primary" @click="AppGrant(scope.row)">应用授权</el-button>
          </template>
        </el-table-column>
        <el-table-column label="" min-width="50" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRecord(scope.row.ROLEID)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 角色维护table end -->
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        class="pagination"
      >
      </el-pagination>
      <!-- 分页 -->
      <!-- 新增角色-弹窗 -->
      <el-dialog
        title="新增角色"
        :visible.sync="dialogAddRoleVisible"
        width="600px"
      >
        <el-form ref="AddRoleForm" :model="temp" label-width="70px">
          <el-form-item label="系统ID:" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-select v-model="temp.value" placeholder="请选择系统" size="mini">
                <el-option
                  v-for="item in temp.options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="角色名称:" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.ROLENAME" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色描述:" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.ROLEDESC" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDialog('AddRole')">取 消</el-button>
          <el-button size="mini" type="primary" @click="addRole()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增角色-弹窗 -->
      <!-- 同步-弹窗 -->
      <sap-role
        @showDialog="closeDialog"
        :dialogsapRoleVisible="dialogsapRoleVisible"
      />
      <!-- 同步-弹窗 -->
      <!-- 关联-弹窗 -->
      <group-role
        @showDialog="closeDialog"
        :roleID="multipleSelection"
        :dialogGroupRoleVisible="dialogGroupRoleVisible"
      />
      <!-- 关联-弹窗 -->
      <!-- 菜单授权-弹窗 -->
      <role-menu
        @showDialog="closeDialog"
        :currentRow="currentRow"
        :dialogRoleMenuVisible="dialogRoleMenuVisible"
      />
      <!-- 菜单授权-弹窗 -->
      <!-- 流程权限-弹窗 -->
      <role-flow
        @showDialog="closeDialog"
        :currentRow="currentRow"
        :flowType="flowType"
        :dialogFlowVisible="dialogFlowVisible"
      />
      <!-- 流程权限-弹窗 -->
      <!-- 用户组授权-弹窗 -->
      <group-permission
        @showDialog="closeDialog"
        :currentRow="currentRow"
        :dialogGroupPermissionVisible="dialogGroupPermissionVisible"
      />
      <!-- 用户组授权-弹窗 -->
      <!-- 审批策略-弹窗 -->
      <role-category
        @showDialog="closeDialog"
        :currentRow="currentRow"
        :dialogCategoryVisible="dialogCategoryVisible"
      />
      <!-- 审批策略-弹窗 -->
      <!-- 应用授权-弹窗 -->
      <app-grant
        @showDialog="closeDialog"
        :currentRow="currentRow"
        :dialogAppGrantVisible="dialogAppGrantVisible"
      />
      <!-- 应用授权-弹窗 -->
    </div>
  </div>
</template>

<script>
import sapRole from './components/sapRole'
import groupRole from './components/GroupRole'
import RoleMenu from './components/RoleMenu'
import RoleFlow from './components/RoleFlow'
import GroupPermission from './components/GroupPermission'
import RoleCategory from './components/RoleCategory'
import AppGrant from './components/AppGrant'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'role-maintenance',
  components: {
    sapRole,
    groupRole,
    RoleMenu,
    RoleFlow,
    GroupPermission,
    RoleCategory,
    AppGrant
  },
  data () {
    return {
      options: [],
      value: null,
      searchValue: '', // 搜索内容
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      dialogsapRoleVisible: false, // 弹窗 同步 默认关闭
      dialogAddRoleVisible: false, // 弹窗 新增角色 默认关闭
      dialogGroupRoleVisible: false, // 弹窗 关联 默认关闭
      dialogRoleMenuVisible: false, // 弹窗 菜单授权 默认关闭
      dialogFlowVisible: false, // 弹窗 流程发起/管理 默认关闭
      dialogGroupPermissionVisible: false, // 弹窗  用户组授权 默认关闭
      dialogCategoryVisible: false, // 弹窗 审批策略 默认关闭
      dialogAppGrantVisible: false, // 弹窗 应用授权 默认关闭
      temp: {
        options: [],
        value: '',
        ROLENAME: '',
        ROLEDESC: ''
      },
      temporaryArr: { // 临时存放row 原数据
        ROLEID: '',
        SYSID: '',
        ROLENAME: '',
        ROLEDESC: '',
        systemCode: ''
      },
      loading: false,
      multipleSelection: '', // 多选集合
      formLabelWidth: '100px',
      roletype: 'EERP_ROLE',
      currentRow: null, // 当前行信息
      flowType: '' // 流程配置类型
    }
  },
  mounted () {
    this.queryAllInfo() // 获取全部角色数据
    this.querySysAll() // 获取所有系统列表
  },
  methods: {
    // 获取全部角色数据
    queryAllInfo (limit = 20, start = 0) {
      this.loading = true
      this.axios_M2.get(`/role/queryAll/${limit}/${start}`)
        .then(this.getInfoSucc)
    },
    // 成功获取数据
    getInfoSucc (res) {
      console.log(res)
      this.loading = true
      let data = res.data
      let addEditData = data.data
      if (addEditData.length > 0) {
        addEditData.forEach((row) => {
          row.edit = false
        })
      }
      if (data.code === 'success') {
        this.tableData = data.data // 用户table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
    },
    // 获取所有系统列表
    querySysAll () {
      this.axios_M2.get('/system/querySysAll')
        .then((res) => {
          if (res.data.code === 'success') {
            this.options = res.data.data
            this.temp.options = res.data.data
            this.temp.options.unshift({
              name: '请选择系统',
              value: ''
            })
          }
        })
    },
    // 查询角色接口
    queryByRole (systemId = 'all', roleName = 'all', limit = 20, start = 0) {
      this.loading = true
      this.axios_M2.get(`/role/queryByRole/${systemId}/${roleName}/${limit}/${start}`)
        .then(this.getInfoSucc)
    },
    // 角色数据查询
    search (start = 0) {
      if (this.searchValue === '') {
        this.queryByRole('all', 'all', this.pageSize, start)
      } else {
        if (this.value === null) {
          this.queryByRole('all', this.searchValue, this.pageSize, start)
        } else {
          this.queryByRole(this.value, this.searchValue, this.pageSize, start)
        }
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.value = null
      this.queryAllInfo()
    },
    // 当前页面条数
    handleSizeChange (val) {
      this.pageSize = val
      this.queryAllInfo(this.pageSize)
    },
    // 页面码数
    handleCurrentChange (val) {
      this.currentPage = val
      let currentNum = (val - 1) * this.pageSize
      this.queryAllInfo(this.pageSize, currentNum)
    },
    // 添加角色 确认
    addRole () {
      let data = {
        CHANGEDAT: parseTime(new Date(), '{y}-{m}-{d}'),
        ROLEDESC: this.temp.ROLENAME,
        ROLENAME: this.temp.ROLENAME,
        SYSID: this.temp.value
      }
      this.axios_M2.post(`/role/${this.roletype}`, data)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
          this.refresh() // 刷新
          this.closeDialog('AddRole')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 双击编辑
    dblclick (row, column, event) {
      console.log(row)
      row.edit = true
      this.temporaryArr.ROLEID = row.ROLEID
      this.temporaryArr.SYSID = row.SYSID
      this.temporaryArr.ROLENAME = row.ROLENAME
      this.temporaryArr.ROLEDESC = row.ROLEDESC
    },
    // 选择系统
    changeSYSID (val) {
      let obj = this.options.find((item) => { // 这里的options就是上面遍历的数据源
        return item.value === val // 筛选出匹配数据，这里的value是你遍历数组每一项的value，如果没有对后台返回的数据做处理，一般为id
      })
      this.temporaryArr.systemCode = obj.name
    },
    // 保存编辑-》更新用户组
    confirmEdit (row) {
      let data = {
        oldRole: {
          ROLEID: this.temporaryArr.ROLEID,
          CHANGEDAT: row.CHANGEDAT,
          ROLEDESC: this.temporaryArr.ROLEDESC,
          ROLENAME: this.temporaryArr.ROLENAME,
          SYSID: this.temporaryArr.SYSID
        },
        newRole: {
          ROLEID: row.ROLEID,
          ROLEDESC: row.ROLENAME,
          ROLENAME: row.ROLEDESC,
          SYSID: row.SYSID
        },
        systemCode: this.temporaryArr.systemCode
      }
      this.axios_M2.put('/role/', data)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
          this.refresh() // 刷新
        })
        .catch((err) => {
          console.log(err)
        })
      row.edit = false
    },
    // 取消编辑
    cancelEdit (row) {
      row.ROLEID = this.temporaryArr.ROLEID
      row.SYSID = this.temporaryArr.SYSID
      row.ROLENAME = this.temporaryArr.ROLENAME
      row.ROLEDESC = this.temporaryArr.ROLEDESC
      row.edit = false
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.ROLEID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 删除 或 批量删除
    deleteRecord (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择角色！'
        })
      } else {
        this.$confirm(`确定要删除选择的角色信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios_M2.delete(`/role/${ID}`)
            .then((res) => {
              console.log(res)
              if (res.data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
              this.refresh() // 刷新
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 授权菜单
    RoleMenu (row) {
      console.log(row)
      this.currentRow = row
      this.openDialog('RoleMenu')
    },
    // 流程配置
    RoleFlow (row, type) {
      console.log(row)
      this.currentRow = row
      this.flowType = type
      this.openDialog('Flow')
    },
    // 用户组授权
    GroupPermission (row) {
      this.currentRow = row
      this.openDialog('GroupPermission')
    },
    // 审批策略授权
    category (row) {
      this.currentRow = row
      this.openDialog('Category')
    },
    // 应用授权
    AppGrant (row) {
      this.currentRow = row
      this.openDialog('AppGrant')
    },
    // 打开对话框
    openDialog (name) {
      switch (name) {
        case 'sapRole':
          this.dialogsapRoleVisible = true
          break
        case 'AddRole':
          this.dialogAddRoleVisible = true
          break
        case 'GroupRole':
          if (this.multipleSelection === '') {
            this.$message({
              type: 'warning',
              message: '请选择角色！'
            })
          } else if (this.multipleSelection.indexOf(',') !== -1) {
            this.$message({
              type: 'warning',
              message: '只能选择一个角色！'
            })
          } else {
            this.dialogGroupRoleVisible = true
          }
          break
        case 'RoleMenu':
          this.dialogRoleMenuVisible = true
          break
        case 'Flow':
          this.dialogFlowVisible = true
          break
        case 'GroupPermission':
          this.dialogGroupPermissionVisible = true
          break
        case 'Category':
          this.dialogCategoryVisible = true
          break
        case 'AppGrant':
          this.dialogAppGrantVisible = true
          break
      }
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'sapRole':
          this.dialogsapRoleVisible = false
          break
        case 'AddRole':
          this.dialogAddRoleVisible = false
          break
        case 'GroupRole':
          this.dialogGroupRoleVisible = false
          break
        case 'RoleMenu':
          this.dialogRoleMenuVisible = false
          break
        case 'Flow':
          this.dialogFlowVisible = false
          break
        case 'GroupPermission':
          this.dialogGroupPermissionVisible = false
          break
        case 'Category':
          this.dialogCategoryVisible = false
          break
        case 'AppGrant':
          this.dialogAppGrantVisible = false
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
  .table {
    margin-top: 5px;
    ::v-deep .el-table-column--selection .cell{
      padding-right: 10px;
    }
    ::v-deep .el-button--mini {
      padding: 5px 8px;
      vertical-align: top;
    }
    .lock {
      margin-left: 5px;
    }
    .btn-l {
      margin-left: 5px;
    }
  }
}
</style>
