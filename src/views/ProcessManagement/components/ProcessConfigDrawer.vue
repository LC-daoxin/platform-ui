<template>
	<el-drawer
		title="策略属性"
		:visible.sync="processConfigDrawer"
		:modal="false"
		direction="rtl"
		:before-close="closeProcessConfigDrawer"
		:with-header="false"
		class="drawer"
		size="50%"
	>
		<h1>策略属性</h1>
		<el-card class="box-card">
			<el-divider content-position="left">策略信息</el-divider>
			<div class="content">
				<div class="content-row"><span class="label">流程分类：</span><span class="text">{{ Info.processClass }}</span></div>
				<div class="content-row"><span class="label">流程名称：</span><span class="text">{{ Info.process }}</span></div>
				<div class="content-row"><span class="label">所属公司：</span><span class="text">{{ Info.CompanyCode }}</span></div>
				<div class="content-row"><span class="label">策略组：</span><span class="text">{{ Info.processBase }}</span></div>
				<div class="content-row"><span class="label">策略组描述：</span><span class="text">{{ Info.processBaseDes }}</span></div>
				<div class="content-row"><span class="label">策略：</span><span class="text">{{ Info.controlPointID }}</span></div>
				<div class="content-row"><span class="label">策略描述：</span><span class="text">{{ Info.controlPointDesc }}</span></div>
			</div>
		</el-card>
		<el-tabs class="drawer-content" v-model="activeName">
			<el-tab-pane label="属性" name="1"><process-config-attribute ref="ProcessConfigAttribute" @updateTree="updateTree" :ProcessConfigData="ProcessConfigData"/></el-tab-pane>
			<el-tab-pane label="邮件" name="2"><notice/></el-tab-pane>
			<el-tab-pane label="用户修改" name="3"><user-modify/></el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>

<script>
import ProcessConfigAttribute from '../components/ProcessConfigAttribute'
import Notice from '../../ProcessDesign/components/Notice'
import UserModify from '../../ProcessDesign/components/UserModify'
export default {
  name: 'process-config-drawer',
  props: {
    activeConfigName: String,
    Info: Object,
    ProcessConfigData: Object,
    processConfigDrawer: {
      default: false
    }
  },
  components: {
    ProcessConfigAttribute,
    Notice,
    UserModify
  },
  data () {
    return {
      activeName: '1'
    }
  },
  mounted () {
    this.activeName = this.activeConfigName
  },
  watch: {
    activeConfigName () {
      this.activeName = this.activeConfigName
    }
  },
  methods: {
    // 关闭策略Drawer
    closeProcessConfigDrawer (done) {
      this.$refs.ProcessConfigAttribute.cancel()
      // done()
      this.$emit('showDialog', 'ConfigDrawer')
    },
    // 刷新Tree
    updateTree () {
      this.$emit('updateTree')
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer {
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
