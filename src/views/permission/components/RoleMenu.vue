<template>
  <el-dialog
    title="配置角色菜单权限"
    :visible.sync="dialogRoleMenuVisible"
    :before-close='cancelSave'
    @open='open'
    width="780px"
  >
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="11">
        <div class="content-box">
          <h3 class="tableTitle">菜单</h3>
          <div class="treeBox">
            <!-- 菜单Tree -->
            <menu-tree
              @getMenuRow="getMenuRow"
            />
            <!-- 菜单Tree -->
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button class="btnRight" type="primary" icon="el-icon-arrow-right" size="mini"></el-button>
      </el-col>
      <el-col :span="11">
        <div class="content-box">
          <h3 class="tableTitle">角色与菜单关联列表</h3>
          <!-- 角色与菜单关联table start -->
          <el-table
            size="mini"
            :data="oldTableData"
            border
            highlight-current-row
            class="oldTable"
            height="450px"
            v-loading="loading2"
          >
            <el-table-column label="菜单名称" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteID(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 角色与菜单关联table end -->
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancelSave()">取 消</el-button>
      <el-button size="mini" type="primary" @click="updateMenu()">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MenuTree from './MenuTree'
export default {
  name: 'group-role',
  components: {
    MenuTree
  },
  props: {
    currentRow: Object,
    dialogRoleMenuVisible: {
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      oldTableData: [],
      loading: false, // 加载
      loading2: false, // 加载
      oldIds: [], // 更新前的关联角色id
      newIds: [], // 更新后的关联角色id
      currentMenuID: '', // 当前选择菜单ID
      permissionType: 'EERP_MENU' // 权限类型
    }
  },
  methods: {
    // Tree回调
    getMenuRow (row) {
      this.addClickMenu(row)
      this.currentMenuID = row.id // 当前选择菜单ID
    },
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'RoleMenu')
    },
    // 打开对话框时，回调
    open () {
      if (this.currentRow) {
        this.getRoleMenuInfo(this.currentRow.ROLEID)
      }
    },
    // 获取当前角色与菜单关联列表
    getRoleMenuInfo (roleId) {
      this.loading2 = true
      this.axios_M2.get(`/permission/oldMenuCheck/${roleId}`)
        .then((res) => {
          console.log(res)
          let data = res.data
          if (data.code === 'success') {
            this.oldTableData = data.data // 角色与用户组关联table
            this.oldIds = [] // 清空old
            this.loading2 = false
            this.oldTableData.forEach((item) => {
              this.oldIds.push(item.id.toString())
            })
          }
        })
    },
    // 添加菜单到关联列表
    addClickMenu (row) {
      let arr = this.oldTableData
      let hasID = false
      arr.forEach((item) => {
        if (item.id === row.id) {
          hasID = true
        }
      })
      if (!hasID) { // 已存在的关联系统不添加
        this.oldTableData.push({
          name: row.text,
          id: row.id
        })
      }
    },
    // 删除关联列表中的菜单
    deleteID (id) {
      let arr = this.oldTableData
      arr.forEach((item, index) => {
        if (item.id === id) {
          this.oldTableData.splice(index, 1)
        }
      })
    },
    // 保存|更新 菜单与角色新关联
    updateMenu () {
      this.newIds = [] // 清空new
      let arr = this.oldTableData
      arr.forEach((item) => {
        this.newIds.push(item.id.toString())
      })
      let data = {
        'newIds': this.newIds,
        'oldIds': this.oldIds
      }
      this.axios_M2.put(`/permission/menuCheck/${this.currentRow.SYSID}/${this.currentRow.ROLEID}/${this.permissionType}`, data)
        .then((res) => {
          console.log(data)
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
      this.handleDialog() // 关闭对话框
    },
    // 取消保存
    cancelSave () {
      this.handleDialog() // 关闭对话框
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.content-box {
  height: 500px;
  .treeBox {
    height: 480px;
    overflow: auto;
  }
  .tableTitle {
    height: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
}
.btnRight {
  margin: 0 auto;
  display: block;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
.oldTable {
  ::v-deep .el-button--mini {
    padding: 5px 8px;
    vertical-align: top;
  }
}
</style>
