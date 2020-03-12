<template>
  <sy-container>
    <el-container class="user-group">
      <el-aside width="25%" class="page-left">
        <!-- 用户组Tree -->
        <group-tree
          @getGroup="getGroup"
        />
        <!-- 用户组Tree -->
      </el-aside>
      <el-main>
        <div class="user">
          <!-- 控制栏 start -->
          <div class="bar">
            <el-row>
              <el-col :span="12">
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="dialogAddGroupVisible = true">添加</el-button>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openRelevance()">关联</el-button>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" :gutter="5" justify="end">
                  <el-col :span="9">
                    <el-input placeholder="搜索..." v-model="searchValue" size="mini"/>
                  </el-col>
                  <el-col :span="15">
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <!-- 控制栏 end -->
          <!-- 用户table start -->
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
            <el-table-column label="名称" min-width="150" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input v-model="scope.row.NAME" class="edit-input" size="mini" />
                </template>
                <span v-else>{{ scope.row.NAME }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组织机构编码" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input v-model="scope.row.ORGANIZATION" class="edit-input" size="mini" />
                </template>
                <span v-else>{{ scope.row.ORGANIZATION }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.UPDATEDON }}</span>
              </template>
            </el-table-column>
            <el-table-column label="" min-width="70" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.edit"
                  type="success"
                  size="mini"
                  @click="confirmEdit(scope.row)"
                >
                  保存
                </el-button>
                <el-button
                  v-if="scope.row.edit"
                  type="primary"
                  plain
                  size="mini"
                  @click="cancelEdit(scope.row)"
                >
                  取消
                </el-button>
                <el-button v-else type="danger" icon="el-icon-delete" size="mini" @click="deleteRecord(scope.row.ID)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 用户table end -->
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
        </div>
      </el-main>
      <!-- 添加用户组-弹窗 -->
      <el-dialog
        title="添加用户组"
        :visible.sync="dialogAddGroupVisible"
        :before-close='handleDialog'
        width="600px"
        class="AddGroup"
      >
        <el-form ref="AddGroupForm" :model="temp" label-width="70px">
          <el-form-item label="名称:" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.NAME" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="组织机构编码:" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.ORGANIZATION" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="addGroup()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加用户组-弹窗 -->
      <!-- 用户组关联-弹窗 -->
      <group-relevance
        @showDialog="closeDialog"
        :dialogRelevanceVisible="dialogRelevanceVisible"
        :currentGroupID="currentGroupID"
      />
      <!-- 用户组关联-弹窗 -->
    </el-container>
  </sy-container>
</template>

<script>
import GroupRelevance from './components/GroupRelevance'
import GroupTree from './components/GroupTree'
export default {
  name: 'user-group',
  components: {
    GroupRelevance,
    GroupTree
  },
  data () {
    return {
      searchValue: '', // 搜索内容
      tableData: [], // 用户组table
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      loading: false, // 加载
      parentID: 0, // 父级ID 默认0
      currentGroupID: '', // 当前选择的用户组ID
      temporaryArr: { // 临时存放row 原数据
        NAME: '',
        ORGANIZATION: '',
        UPDATEDON: ''
      },
      multipleSelection: '', // 多选
      dialogAddGroupVisible: false, // 添加用户组-显隐
      temp: {
        NAME: '',
        ORGANIZATION: ''
      },
      formLabelWidth: '100px',
      dialogRelevanceVisible: false // 弹窗 用户组关联 默认关闭
    }
  },
  mounted () {
    // 初始化获取数据
    this.getGroupInfo() // 用户组数据
  },
  methods: {
    // 获取用户组table
    getGroupInfo (groupId = 0, name = 'all', limit = 20, start = 0) {
      this.loading = true
      this.axios.get(`/group/groupChildQuery/${groupId}/${name}/${limit}/${start}`)
        .then((res) => {
          if (res.data.code === 'success') {
            let data = res.data
            let addEditData = data.data
            if (addEditData.length > 0) {
              addEditData.forEach((row) => {
                row.edit = false
              })
            }
            this.tableData = addEditData
            this.totalCount = data.total // 总条数
            this.pageSize = data.pagesize // 页条数
            this.currentPage = data.pageNum // 当前页码
            this.loading = false
          }
        })
    },
    // 用户组查询
    search (start = 0) {
      if (this.searchValue === '') {
        this.getGroupInfo(this.parentID, 'all', this.pageSize, start)
      } else {
        this.getGroupInfo(this.parentID, this.searchValue, this.pageSize, start)
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.getGroupInfo(this.parentID)
    },
    // Tree回调
    getGroup (id) {
      this.parentID = id // 父节点ID
      this.currentGroupID = id // 当前选择用户组ID
      this.getGroupInfo(id)
    },
    // 当前页面条数
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 页面码数
    handleCurrentChange (val) {
      this.currentPage = val
      let currentNum = (val - 1) * this.pageSize
      this.search(currentNum)
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'Relevance':
          this.dialogRelevanceVisible = false
          break
      }
    },
    // 双击编辑
    dblclick (row, column, event) {
      console.log(row)
      row.edit = true
      this.temporaryArr.NAME = row.NAME
      this.temporaryArr.ORGANIZATION = row.ORGANIZATION
      this.temporaryArr.UPDATEDON = row.UPDATEDON
    },
    // 保存编辑-》更新用户组
    confirmEdit (row) {
      this.axios.put('/group/', {
        ID: row.ID,
        NAME: row.NAME,
        ORGANIZATION: row.ORGANIZATION
      })
        .then((res) => {
          if (res.data.code === 'success') {
            this.refresh() // 刷新
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.search()
          }
        })
        .catch((err) => {
          console.log(err)
        })
      row.edit = false
    },
    // 取消编辑
    cancelEdit (row) {
      row.NAME = this.temporaryArr.NAME
      row.ORGANIZATION = this.temporaryArr.ORGANIZATION
      row.UPDATEDON = this.temporaryArr.UPDATEDON
      row.edit = false
    },
    // 关闭添加用户组对话框
    handleDialog () {
      this.dialogAddGroupVisible = false
    },
    // 添加用户组
    addGroup () {
      this.axios.post('/group/', {
        PARENTID: this.parentID,
        NAME: this.temp.NAME,
        ORGANIZATION: this.temp.ORGANIZATION
      })
        .then((res) => {
          if (res.data.code === 'success') {
            this.refresh() // 刷新
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.handleDialog()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.ID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 删除用户组
    deleteRecord (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户组！'
        })
      } else {
        this.$confirm('确定要删除选中的记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/group/${ID}`)
            .then((res) => {
              if (res.data.code === 'success') {
                this.refresh() // 刷新
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 关联
    openRelevance () {
      if (this.currentGroupID === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户组'
        })
      } else {
        this.dialogRelevanceVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-button+.el-button {
  margin-left: 8px;
}
::v-deep .el-table-column--selection .cell{
  padding-right: 10px;
}
::v-deep .el-main {
  padding: 0;
}

.user-group {
  height: calc(100vh);
  .page-left {
    height: 100%;
    border-right: 1px solid #eaecef;
  }
  .user {
    padding: 8px;
    .table {
      margin-top: 5px;
      ::v-deep .el-button--mini {
        padding: 5px 8px;
        vertical-align: top;
      }
    }
  }
  .AddGroup {
    ::v-deep .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
