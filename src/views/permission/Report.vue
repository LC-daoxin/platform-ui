<template>
  <el-container class="user-permisson">
    <el-aside width="25%" class="page-left">
      <!-- 单位Tree -->
      <report-group-tree
        v-if="isTree"
        @refreshTree="refreshCompanyTree"
        @getReportRow="getReportRow"
      />
      <!-- 单位Tree -->
    </el-aside>
    <el-main>
      <div class="user">
        <!-- 控制栏 start -->
        <div class="bar">
          <el-row>
            <el-col :span="24">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addCompany('0')">新增二级单位</el-button>
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addUserCompany()">新增用户单位</el-button>
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-s-check" @click="openApp()">单据分类</el-button>
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-s-operation" @click="OpenAppManage()">应用管理</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 控制栏 end -->
        <div class="content" v-if="this.currentCompanyID !== '' && this.AppManageShow === false">
          <el-row>
            <el-col :span="24">
              <el-tabs type="border-card">
                <el-tab-pane label="管理员列表">
                  <!-- 管理员 -->
                  <administrator
                    :currentCompanyID="currentCompanyID"
                  />
                  <!-- 管理员 -->
                </el-tab-pane>
                <el-tab-pane label="流程列表">
                  <!-- 流程 -->
                  <report-process
                    :currentCompanyID="currentCompanyID"
                  />
                  <!-- 流程 -->
                </el-tab-pane>
                <el-tab-pane label="应用列表">
                  <!-- 应用 -->
                  <report-app
                    :currentCompanyID="currentCompanyID"
                  />
                  <!-- 应用 -->
                </el-tab-pane>
                <el-tab-pane label="公司代码列表">
                  <el-row>
                    <el-col :span="24">
                      <span>多个代码，用"|"分开</span>
                    </el-col>
                  </el-row>
                  <el-row class="companyRow" :gutter="15">
                    <el-col :span="18">
                      <el-input placeholder="" v-model="companyCode" clearable size="mini"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-document-checked" @click="saveCompanyCode()">保存</el-button>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
        <div class="content" v-if="AppManageShow">
          <el-row>
            <el-col :span="24">
              <!-- 应用管理 -->
              <app-manage
                :currentCompanyID="currentCompanyID"
              />
              <!-- 应用管理 -->
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
    <!-- 新增二级单位和用户单位-弹窗 -->
    <add-company
      @showDialog="closeDialog"
      @refreshTree="refreshCompanyTree"
      :dialogAddCompanyVisible="dialogAddCompanyVisible"
      :companyID="companyID"
    />
    <!--新增二级单位和用户单位-弹窗 -->
    <!-- 应用分类-弹窗 -->
    <app-category
      @showDialog="closeDialog"
      :dialogAddCategoryVisible="dialogAddCategoryVisible"
      :CategoryBtnType="CategoryBtnType"
    />
    <!-- 应用分类-弹窗 -->
  </el-container>
</template>

<script>
import ReportGroupTree from './components/ReportGroupTree'
import AddCompany from './components/AddCompany'
import Administrator from './components/Administrator'
import ReportProcess from './components/ReportProcess'
import ReportApp from './components/ReportApp'
import AppCategory from './components/AppCategory'
import AppManage from './components/AppManage'
export default {
  name: 'report',
  components: {
    ReportGroupTree,
    AddCompany,
    Administrator,
    ReportProcess,
    ReportApp,
    AppCategory,
    AppManage
  },
  data () {
    return {
      currentCompanyID: '', // 当前选择的公司ID
      dialogAddCompanyVisible: false, // 弹窗 新增二级单位
      dialogAddCategoryVisible: false, // 弹窗 应用分类
      companyCode: '', // 公司代码
      companyID: '', // 新增单位父级ID
      isTree: true, // 单位Tree刷新
      CategoryBtnType: 1, // 应用分类 1为关闭 2为选择
      AppManageShow: false // 应用管理默认隐藏
    }
  },
  mounted () {
  },
  methods: {
    // Tree回调
    getReportRow (row) {
      this.currentCompanyID = row.ID // 当前选择的公司ID
      this.AppManageShow = false
      this.companyID = row.ID // 新增单位父级ID
    },
    // 新增二级单位
    addCompany (id) {
      this.companyID = id
      this.dialogAddCompanyVisible = true
    },
    // 新增用户单位
    addUserCompany () {
      if (this.companyID === '') {
        this.$message({
          type: 'warning',
          message: '请选择被添加的二级单位'
        })
      } else if (this.companyID === 1) {
        this.$message({
          type: 'warning',
          message: '选择的单位节点只能添加二级单位，请重新选择'
        })
      } else {
        this.dialogAddCompanyVisible = true
      }
    },
    // 保存公司代码
    saveCompanyCode () {
      console.log(`/reportmanage/updateGroupCompanyCode/${this.currentCompanyID}/${this.companyCode}`)
      this.axios_M2.put(`/reportmanage/updateGroupCompanyCode/${this.currentCompanyID}/${this.companyCode}`).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.refresh()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 单据分类
    openApp () {
      this.dialogAddCategoryVisible = true
    },
    // 打开应用管理
    OpenAppManage () {
      this.AppManageShow = true
    },
    // 刷新单位Tree
    refreshCompanyTree () {
      this.isTree = false
      this.$nextTick(() => (this.isTree = true))
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'AddCompany':
          this.dialogAddCompanyVisible = false
          break
        case 'AddCategory':
          this.dialogAddCategoryVisible = false
          break
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
.user-permisson {
  height: 100%;
  .page-left {
    height: 100%;
    border-right: 1px solid #eaecef;
  }
  .user {
    padding: 12px;
    .content {
      padding: 15px 5px;
      .companyRow {
        margin-top: 10px;
      }
    }
  }
}
</style>
