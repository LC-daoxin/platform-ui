<template>
  <div class="dashboard-editor-container">
    <header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input placeholder="流程分类" v-model="searchValue" size="mini" clearable/>
        </el-col>
        <el-col :span="20">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="searchClass">查询</el-button>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-refresh" @click="refreshClass">刷新</el-button>
          <el-button type="success" icon="el-icon-folder-add" size="mini" @click="openDialog('AddClass')">新增流程分类</el-button>
        </el-col>
      </el-row>
    </header>
    <main>
      <el-tree
        v-if="isClass"
        :data="data"
        node-key="treeID"
        :props="defaultProps"
        ref="ProcessTree"
        :default-expanded-keys="[0]"
        @node-click="handleNodeClick"
        :load="loadNode"
        lazy
        :expand-on-click-node="false"
      >
        <div class="custom-tree" slot-scope="{ node, data }">
          <span class="custom-tree-node" v-if="node.level === 1" @mouseover="selectStyle(node, $event)" @mouseout="outStyle(node, $event)">
            <span>
              <i class="process el-icon-folder"></i>
              <span :class="data.status ? '' : 'info'">{{ node.data.displayName }}</span>
            </span>
            <span :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="添加流程" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openDialog('AddProcess', data, node)">
                  <i class="iconfont pl-tianjia1 success"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除流程分类" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="deleteClass(data)">
                  <i class="iconfont pl-ic_del danger"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
          <span class="custom-tree-node" v-if="node.level === 2" @mouseover="selectStyle(node, $event)" @mouseout="outStyle(node, $event)">
            <span>
              <i :class="{ 'process': data.Status, 'info': !data.Status, 'iconfont pl-shengchanliuchengguanli': true}"></i>
              <span :class="data.status ? '' : 'info'">{{ node.data.DisplayName }}</span>
            </span>
            <span v-if="data.Status" :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessDrawer('1', data)">
                  <i class="iconfont pl-bianji warning"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加策略组" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openDialog('AddProcessBase', data, node)">
                  <i class="iconfont pl-tianjia1 success"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="功能调用" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessDrawer('2', data)">
                  <i class="iconfont pl-gongneng-"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="流程变量" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessDrawer('3', data)">
                  <i class="iconfont pl-liuchengguanli"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="邮件模版" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessDrawer('4', data)">
                  <i class="iconfont pl-youjian"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用流程" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="stopProcess(data, node)">
                  <i class="iconfont pl-jinyong danger"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除流程" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="deleteProcess(data)">
                  <i class="iconfont pl-ic_del danger"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span v-else :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="启用" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="startProcess(data, node)">
                  <i class="iconfont pl-qiyong success"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
          <span class="custom-tree-node" v-if="node.level === 3" @mouseover="selectStyle(node, $event)" @mouseout="outStyle(node, $event)">
            <span>
              <i  :class="{ 'strategyGroup': data.Status, 'info': !data.Status, 'iconfont pl-shijiancelveweihu': true}"></i>
              <span :class="data.Status ? 'groupText' : 'info TextWidth'">{{ node.data.controlPointTypeCode }}</span>
              <span class="describe">{{ node.data.controlPointTypeCodeDesc }}</span>
            </span>
            <span v-if="data.Status" :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessBaseDrawer('1', data)">
                  <i class="iconfont pl-bianji warning"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加策略" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openDialog('AddProcessConfig', data, node)">
                  <i class="iconfont pl-tianjia1 success"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="入口规则" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessBaseDrawer('2', data)">
                  <i class="iconfont pl-guizeguanli1"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="stopProcessBase(data, node)">
                  <i class="iconfont pl-jinyong danger"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除策略组" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="deleteProcessBase(data)">
                  <i class="iconfont pl-ic_del danger"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span v-else :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="启动" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="startProcessBase(data, node)">
                  <i class="iconfont pl-qiyong success"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
          <span class="custom-tree-node" v-if="node.level === 4" @mouseover="selectStyle(node, $event)" @mouseout="outStyle(node, $event)">
            <span>
              <i  :class="{ 'strategy': data.Status, 'info': !data.Status, 'iconfont pl-jiagecelve': true}"></i>
              <span :class="data.Status ? 'groupText' : 'info TextWidth'">{{ node.data.controlPointID }}</span>
              <span class="describe">{{ node.data.controlPointDesc }}</span>
            </span>
            <span v-if="data.Status" :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessConfigDrawer('1', data)">
                  <i class="iconfont pl-bianji warning"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审批节点" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="routerNode(data, node)">
                  <i class="iconfont pl-changyongtubiao_liuchengguanli"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="邮件" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="openProcessConfigDrawer('2', data)">
                  <i class="iconfont pl-youjian"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="stopProcessConfig(data, node)">
                  <i class="iconfont pl-jinyong danger"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除策略" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="deleteProcessConfig(data)">
                  <i class="iconfont pl-ic_del danger"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span v-else :class="node.isCurrent ? 'active' : 'noactive'">
              <el-tooltip class="item" effect="dark" content="启动" placement="bottom" :enterable="false">
                <el-button size="mini" type="text" @click="startProcessConfig(data, node)">
                  <i class="iconfont pl-qiyong success"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
        </div>
      </el-tree>
    </main>
    <el-drawer
      title="流程属性"
      :visible.sync="processDrawer"
      :modal="false"
      direction="rtl"
      :before-close="closeProcessDrawer"
      :with-header="false"
      class="drawer"
      size="50%"
    >
      <h1>流程属性</h1>
      <el-card class="box-card">
        <el-divider content-position="left">流程信息</el-divider>
        <div class="content">
          <div class="content-row"><span class="label">流程分类：</span><span class="text">{{ Info.processClass }}</span></div>
          <div class="content-row"><span class="label">流程名称：</span><span class="text">{{ Info.process }}</span></div>
          <div class="content-row"><span class="label">所属公司：</span><span class="text">{{ Info.CompanyCode }}</span></div>
        </div>
      </el-card>
      <el-tabs class="drawer-content" v-model="activeName">
        <el-tab-pane label="属性" name="1"><attribute ref="attribute" @updateTree="refreshNodeBy(currentNode.parent.key)" :ProcessData="ProcessData"/></el-tab-pane>
        <el-tab-pane label="功能调用" name="2"><process-configuration ref="configuration" Type="process"/></el-tab-pane>
        <el-tab-pane label="流程变量" name="3"><process-variable/></el-tab-pane>
        <el-tab-pane label="邮件模版" name="4">邮件模版</el-tab-pane>
      </el-tabs>
    </el-drawer>
    <el-drawer
      title="策略组属性"
      :visible.sync="processBaseDrawer"
      :modal="false"
      direction="rtl"
      :before-close="closeProcessBaseDrawer"
      :with-header="false"
      class="drawer"
      size="50%"
    >
      <h1>策略组属性</h1>
      <el-card class="box-card">
        <el-divider content-position="left">策略组信息</el-divider>
        <div class="content">
          <div class="content-row"><span class="label">流程分类：</span><span class="text">{{ Info.processClass }}</span></div>
          <div class="content-row"><span class="label">流程名称：</span><span class="text">{{ Info.process }}</span></div>
          <div class="content-row"><span class="label">所属公司：</span><span class="text">{{ Info.CompanyCode }}</span></div>
          <div class="content-row"><span class="label">策略组：</span><span class="text">{{ Info.processBase }}</span></div>
          <div class="content-row"><span class="label">策略组描述：</span><span class="text">{{ Info.processBaseDes }}</span></div>
        </div>
      </el-card>
      <el-tabs class="drawer-content" v-model="activeBaseName">
        <el-tab-pane label="属性" name="1"><process-base-attribute ref="ProcessBaseAttribute" @updateTree="refreshNodeBy(currentNode.parent.key)" :ProcessBaseData="ProcessBaseData" /></el-tab-pane>
        <el-tab-pane label="入口规则" name="2"><process-reference  :ProcessBaseData="ProcessBaseData"/></el-tab-pane>
      </el-tabs>
    </el-drawer>
    <el-dialog
      title="新增流程分类"
      :visible.sync="addDialogVisible"
      width="420px">
      <el-form ref="addClassForm" :rules="addClassRules" size="mini" :model="addForm" label-width="100px">
        <el-form-item label="流程全称：" prop="fullName">
          <el-input v-model="addForm.fullName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="显示名称：" prop="displayName">
          <el-input v-model="addForm.displayName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="set编码：" prop="setCode">
          <el-input v-model="addForm.setCode" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClass" size="mini">提交</el-button>
        <el-button type="primary" @click="closeDialog('AddClass')" size="mini">取消</el-button>
      </span>
    </el-dialog>
    <!-- 策略drawer-弹窗 -->
    <process-config-drawer
      ref="processConfig"
      @updateTree="refreshNodeBy(currentNode.parent.key)"
      @showDialog="closeDialog"
      :activeConfigName="activeConfigName"
      :Info="Info"
      :ProcessConfigData="ProcessConfigData"
      :processConfigDrawer="processConfigDrawer"
    />
    <!-- 策略drawer-弹窗 -->
    <!-- 新增流程-弹窗 -->
    <add-process
      @showDialog="closeDialog"
      :ProcessClassData="ProcessClassData"
      :addProcessVisible="addProcessVisible"
    />
    <!-- 新增流程-弹窗 -->
    <!-- 新增策略组-弹窗 -->
    <add-process-base
      @showDialog="closeDialog"
      :ProcessData="ProcessData"
      :addProcessBaseVisible="addProcessBaseVisible"
    />
    <!-- 新增策略组-弹窗 -->
    <!-- 新增策略-弹窗 -->
    <add-process-config
      @showDialog="closeDialog"
      :ProcessBaseData="ProcessBaseData"
      :addProcessConfigVisible="addProcessConfigVisible"
    />
    <!-- 新增策略-弹窗 -->
  </div>
</template>

<script>
import ProcessConfiguration from '../ProcessDesign/components/ProcessConfiguration'
import ProcessVariable from '../ProcessDesign/components/ProcessVariable'
import Attribute from './components/Attribute'
import AddProcess from './components/AddProcess'
import AddProcessBase from './components/AddProcessBase'
import ProcessBaseAttribute from './components/ProcessBaseAttribute'
import AddProcessConfig from './components/AddProcessConfig'
import ProcessReference from './components/ProcessReference'
import ProcessConfigDrawer from './components/ProcessConfigDrawer'
import { mapMutations } from 'vuex'
export default {
  name: 'process-management',
  components: {
    ProcessVariable,
    ProcessConfiguration,
    Attribute,
    AddProcess,
    AddProcessBase,
    ProcessBaseAttribute,
    AddProcessConfig,
    ProcessReference,
    ProcessConfigDrawer
  },
  data () {
    return {
      searchValue: '', // 搜索流程分类
      data: null,
      addForm: {
        fullName: '',
        displayName: '',
        setCode: ''
      },
      addClassRules: {
        fullName: [
          { required: true, message: '请输入流程全称', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        setCode: [
          { required: true, message: '请输入set编码', trigger: 'blur' }
        ]
      },
      isClass: true, // 刷新tree
      processDrawer: false, // 流程Drawer
      processBaseDrawer: false, // 策略组Drawer
      processConfigDrawer: false, // 策略Drawer
      Info: {
        processClass: '', // 当前流程分类
        process: '', // 当前流程
        CompanyCode: '', // 所属公司
        processBase: '', // 策略组
        processBaseDes: '', // 策略组描述
        controlPointID: '', // 策略
        controlPointDesc: '' // 策略描述
      },
      defaultProps: {
        label: function (data, node) {
          if (node.level === 1) {
            return { processClass: data.displayName } // 返回流程分类名
          } else if (node.level === 2) {
            return { process: data.DisplayName, CompanyCode: data.CompanyCode } // 返回流程名 所属公司
          } else if (node.level === 3) {
            return { processBase: data.controlPointTypeCode, processBaseDes: data.controlPointTypeCodeDesc } // 返回策略组名称 策略组描述
          } else if (node.level === 4) {
            return { controlPointID: data.controlPointID, controlPointDesc: data.controlPointDesc } // 返回策略名称 策略描述
          }
        },
        isLeaf: function (data) {
          return !data.Leaf
        }
      },
      activeName: '1', // 流程属性Tabs
      activeBaseName: '1', // 策略组属性Tabs
      activeConfigName: '1', // 策略属性Tabs
      addDialogVisible: false, // 新增流程分类
      addProcessVisible: false, // 新增流程
      addProcessBaseVisible: false, // 新增策略组
      addProcessConfigVisible: false, // 新增策略
      currentNode: {}, // 当前node节点数据
      ProcessClassData: {}, // 流程分类数据
      ProcessData: {}, // 流程数据
      ProcessBaseData: {}, // 策略组数据
      ProcessConfigData: {} // 策略数据
    }
  },
  methods: {
    // 返回唯一标识
    getUUID () {
      return Math.random().toString(36)
    },
    // 打开对话框
    openDialog (name, data = null, node = null) {
      switch (name) {
        case 'AddClass': // 新增流程分类
          this.addDialogVisible = true
          break
        case 'AddProcess': // 新增流程
          this.ProcessClassData = data
          this.addProcessVisible = true
          break
        case 'AddProcessBase': // 新增策略组
          this.ProcessData = data
          this.addProcessBaseVisible = true
          break
        case 'AddProcessConfig': // 新增策略
          this.ProcessBaseData = data
          this.addProcessConfigVisible = true
          break
      }
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'AddClass':
          this.clearAddForm()
          this.$refs['addClassForm'].resetFields()
          this.addDialogVisible = false
          break
        case 'AddProcess':
          this.addProcessVisible = false
          this.refreshNodeBy(this.currentNode.key)
          break
        case 'AddProcessBase':
          this.addProcessBaseVisible = false
          this.refreshNodeBy(this.currentNode.key)
          break
        case 'AddProcessConfig':
          this.addProcessConfigVisible = false
          this.refreshNodeBy(this.currentNode.key)
          break
        case 'ConfigDrawer':
          this.processConfigDrawer = false
          break
      }
    },
    // 新增流程分类
    addClass () {
      this.$refs['addClassForm'].validate((valid) => {
        if (valid) {
          let data = {
            fullName: this.addForm.fullName,
            displayName: this.addForm.displayName,
            setCode: this.addForm.setCode
          }
          this.axios_M4.post(`/processgroup/`, data).then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.closeAddClass()
              this.refreshClass()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 删除流程分类
    deleteClass (item) {
      this.$confirm(`确定要删除 '${item.displayName}' 流程分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/procset/${item.procSetId}`)
          .then((res) => {
            console.log(res)
            if (res.data.code === 'success') {
              if (res.data.data === null) {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
                this.searchClass() // 刷新
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.data
                })
              }
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 清空addForm
    clearAddForm () {
      this.temp = {
        appName: '',
        displayName: '',
        setCode: ''
      }
    },
    // 刷新Class
    refreshClass () {
      this.isClass = false
      this.$nextTick(() => (this.isClass = true))
    },
    // 搜索Class
    searchClass () {
      if (this.searchValue !== '') {
        this.axios_M4.get(`/procset/${this.searchValue}/all/10000/1`)
          .then(res => {
            let data = res.data
            console.log(data)
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.Leaf = true
                })
              }
              this.data = arr
            }
          })
      } else {
        this.refreshClass()
      }
    },
    // 点击tree Node
    handleNodeClick (data, node) {
      if (node.level === 2) {
        this.Info.processClass = node.parent.label.processClass
        this.Info.process = node.label.process
        this.Info.CompanyCode = node.label.CompanyCode
      } else if (node.level === 3) {
        this.Info.processClass = node.parent.parent.label.processClass
        this.Info.process = node.parent.label.process
        this.Info.CompanyCode = node.parent.label.CompanyCode
        this.Info.processBase = node.label.processBase
        this.Info.processBaseDes = node.label.processBaseDes
      } else if (node.level === 4) {
        this.Info.processClass = node.parent.parent.parent.label.processClass
        this.Info.process = node.parent.parent.label.process
        this.Info.CompanyCode = node.parent.parent.label.CompanyCode
        this.Info.processBase = node.parent.label.processBase
        this.Info.processBaseDes = node.parent.label.processBaseDes
        this.Info.controlPointID = node.label.controlPointID
        this.Info.controlPointDesc = node.label.controlPointDesc
      }
      this.currentNode = node
      console.log(data)
      console.log(node)
    },
    // 动态加载tree
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.axios_M4.get(`/procset/list`)
          .then(res => {
            let data = res.data
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.Leaf = true
                  row.treeID = this.getUUID()
                })
              }
              resolve(arr)
            }
          })
      }
      if (node.level === 1) {
        this.axios_M4.get(`/process/${node.data.procSetId}/all/100000/1`)
          .then(res => {
            let data = res.data
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.Status ? row.Leaf = true : row.Leaf = false
                  row.treeID = this.getUUID()
                })
              }
              resolve(arr)
            }
          })
      }
      if (node.level === 2) {
        this.axios_M4.get(`/processbase/ByProcess/${node.data.ProcessID}`)
          .then(res => {
            let data = res.data
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.Status ? row.Leaf = true : row.Leaf = false
                  row.treeID = this.getUUID()
                })
              }
              // console.log(arr)
              resolve(arr)
            }
          })
      }
      if (node.level === 3) {
        this.axios_M4.get(`/processconfig/ByProcessBase/${node.data.ProcessBaseID}`)
          .then(res => {
            let data = res.data
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.treeID = this.getUUID()
                })
              }
              // console.log(arr)
              resolve(arr)
            }
          })
      }
    },
    // 打开流程属性Drawer
    openProcessDrawer (type, data = null) {
      this.ProcessData = data
      this.activeName = type
      this.processDrawer = true
      this.$nextTick(() => {
        this.$refs.configuration.init(data) // 功能调用初始化
      })
    },
    // 关闭流程Drawer 回调
    closeProcessDrawer (done) {
      this.$refs.attribute.cancel()
      done()
    },
    // 鼠标滑入
    selectStyle (node, event) {
      if (!node.isCurrent) {
        let el = event.currentTarget.childNodes[1]
        el.classList.add('active')
        el.classList.remove('noactive')
      }
    },
    // 鼠标滑出
    outStyle (node, event) {
      if (!node.isCurrent) {
        let el = event.currentTarget.childNodes[1]
        el.classList.add('noactive')
        el.classList.remove('active')
      }
    },
    // 禁用流程
    stopProcess (data, node) {
      this.$confirm(`确定要禁用 '${data.DisplayName}' 流程?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.put(`/process/enable/0/${data.ProcessID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: '已禁用'
              })
              this.refreshNodeBy(node.parent.key)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 启用流程
    startProcess (data, node) {
      this.$confirm(`确定要启用 '${data.DisplayName}' 流程?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.put(`/process/enable/1/${data.ProcessID}/`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: '已启用'
              })
              this.refreshNodeBy(node.parent.key)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除流程
    deleteProcess (item) {
      this.$confirm(`确定要删除 '${item.DisplayName}' 流程?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/process/${item.ProcessID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              if (res.data.data === null) {
                this.$message({
                  type: 'success',
                  message: '成功删除流程！'
                })
                this.refreshNodeBy(this.currentNode.parent.key)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.data
                })
              }
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 打开策略组Drawer
    openProcessBaseDrawer (type, data = null) {
      this.ProcessBaseData = data
      this.activeBaseName = type
      this.processBaseDrawer = true
    },
    // 关闭策略组Drawer 回调
    closeProcessBaseDrawer (done) {
      this.$refs.ProcessBaseAttribute.cancel()
      done()
    },
    // 删除策略组
    deleteProcessBase (item) {
      this.$confirm(`确定要删除 '${item.controlPointTypeCode}' 策略组?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/processbase/${item.ProcessBaseID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              if (res.data.data === null) {
                this.$message({
                  type: 'success',
                  message: '成功删除策略组！'
                })
                this.refreshNodeBy(this.currentNode.parent.key)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.data
                })
              }
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 启用策略组
    startProcessBase (data, node) {
      this.$confirm(`确定要启用 '${data.controlPointTypeCode}' 策略组?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.put(`/processbase/enable/1/${data.ProcessBaseID}/`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: '已启用'
              })
              this.refreshNodeBy(node.parent.key)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 禁用策略组
    stopProcessBase (data, node) {
      this.$confirm(`确定要禁用 '${data.controlPointTypeCode}' 策略组?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.put(`/processbase/enable/0/${data.ProcessBaseID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: '已禁用'
              })
              this.refreshNodeBy(node.parent.key)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 启用策略
    startProcessConfig (data, node) {
      this.$confirm(`确定要启用 '${data.controlPointID}' 策略?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.put(`/processconfig/enable/1/${data.processConfigID}/`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: '已启用'
              })
              this.refreshNodeBy(node.parent.key)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 禁用策略
    stopProcessConfig (data, node) {
      this.$confirm(`确定要禁用 '${data.controlPointID}' 策略?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.put(`/processconfig/enable/0/${data.processConfigID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: '已禁用'
              })
              this.refreshNodeBy(node.parent.key)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除策略
    deleteProcessConfig (item) {
      this.$confirm(`确定要删除 '${item.controlPointID}' 策略?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/processconfig/${item.processConfigID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              if (res.data.data === null) {
                this.$message({
                  type: 'success',
                  message: '成功删除策略！'
                })
                this.refreshNodeBy(this.currentNode.parent.key)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.data
                })
              }
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 打开策略Drawer
    openProcessConfigDrawer (type, data = null) {
      this.ProcessConfigData = data
      this.activeConfigName = type
      this.processConfigDrawer = true
      this.$nextTick(() => {
        this.$refs.processConfig.init()
      })
    },
    // 映射出 setConfigDate方法
    ...mapMutations('sysStore/processConfig', [
      'setConfigDate',
      'setInfo',
      'startStatus'
    ]),
    // 审批节点跳转传参
    routerNode (data, node) {
      this.setConfigDate(data)
      this.setInfo(this.Info)
      this.startStatus() // 触发流程设计刷新
      this.$router.push('/work-flow/process-design')
    },
    // 局部刷新节点
    refreshNodeBy (id) {
      if (this.$refs.ProcessTree.getNode(id) != null) {
        let node = this.$refs.ProcessTree.getNode(id) // 通过节点id找到对应树节点对象
        node.loaded = false
        node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  margin-bottom: 12px;
}
main {
  width: 80%;
}
.custom-tree {
  width: 100%;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    height: 24px;
    i.process {
      margin-right: 5px;
      font-weight: bold;
      color: #96a7ff;
    }
    i.info {
      margin-right: 5px;
      color: #909399;
    }
    span.info {color: #909399}
    i.danger { color: #F56C6C; }
    i.warning { color: #E6A23C; }
    i.success { color: #67C23A; }
    i.strategyGroup {
      margin-right: 5px;
      color: #9a6e3a;
    }
    i.strategy {
      margin-right: 5px;
      color: #eed61f;
    }
    .groupText {
      display: inline-block;
      width: 180px;
    }
    .TextWidth {
      display: inline-block;
      width: 180px;
    }
    .describe {
      display: inline-block;
      font-weight: 100;
    }
    .active {
      display: inline-block;
    }
    .noactive {
      display: none;
    }
  }
  ::v-deep .el-button--mini {
    padding: 0;
  }
}
.drawer {
  ::v-deep .el-drawer {
    overflow: auto;
  }
  ::v-deep .el-tabs--top {
    border-top: none !important;
  }
  ::v-deep .el-divider--horizontal {
    margin: 0 !important;
  }
  .box-card {
    width: 96%;
    margin: 10px auto 0;
    .content {
      margin-top: 16px;
      &-row {
        font-size: 14px;
        margin-bottom: 2px;
        .label {
          display: inline-block;
          width: 85px;
          text-align: right;
          margin-right: 10px;
        }
        .text {
          font-weight: 200;
        }
      }
    }
  }
  h1 {
    background: #f9f9f9;
    font-size: 18px;
    font-weight: 400;
    padding: 10px 20px;
    margin: 0;
  }
  .drawer-content {
    // margin-top: 20px;
    padding: 0 10px;
    border-top: 1px solid #cfd7e5;
  }
}
</style>
