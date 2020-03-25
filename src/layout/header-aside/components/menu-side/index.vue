<template>
  <div class="sy-layout-header-aside-menu-side">
    <el-menu
      :collapse="asideCollapse"
      :unique-opened="true"
      :default-active="active"
      ref="menu"
      @select="handleMenuSelect">
      <template v-for="(menu, menuIndex) in aside">
        <sy-layout-header-aside-menu-item v-if="menu.children === undefined" :menu="menu" :key="menuIndex"/>
        <sy-layout-header-aside-menu-sub v-else :menu="menu" :key="menuIndex"/>
      </template>
    </el-menu>
    <div v-if="aside.length === 0 && !asideCollapse" class="sy-layout-header-aside-menu-empty" flex="dir:top main:center cross:center">
      <sy-icon name="inbox"/>
      <span>{{$t('layout.header-aside.menu-side.empty')}}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import syLayoutMainMenuItem from '../components/menu-item/index.vue'
import syLayoutMainMenuSub from '../components/menu-sub/index.vue'
import BScroll from 'better-scroll'
export default {
  name: 'sy-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  components: {
    'sy-layout-header-aside-menu-item': syLayoutMainMenuItem,
    'sy-layout-header-aside-menu-sub': syLayoutMainMenuSub
  },
  data () {
    return {
      active: '',
      asideHeight: 300,
      BS: null,
      aside: [
        {
          icon: 'pl-yingxiaogongzuoliu',
          iconSvg: '',
          title: '工作流',
          path: '',
          children: [
            {
              icon: 'pl-shengchanliuchengguanli',
              iconSvg: '',
              title: '流程管理',
              path: '/work-flow/process-management'
            },
            {
              icon: 'pl-gongzuoliuchakan',
              iconSvg: '',
              title: '流程目录',
              path: '/work-flow/process-catalog'
            },
            {
              icon: 'pl-youjian',
              iconSvg: '',
              title: '邮件模板',
              path: '/work-flow/mail-template'
            },
            {
              icon: 'pl-daiban',
              iconSvg: '',
              title: '我的待办',
              path: '/work-flow/my-todo'
            },
            {
              icon: 'pl-renwu-copy',
              iconSvg: '',
              title: '我的代理',
              path: '/work-flow/my-proxy'
            },
            {
              icon: 'pl-yiban-moren',
              iconSvg: '',
              title: '我的已办',
              path: '/work-flow/my-done'
            },
            {
              icon: 'pl-shenqing',
              iconSvg: '',
              title: '我的申请',
              path: '/work-flow/my-request'
            },
            {
              icon: 'pl-faqirenwuxietong',
              iconSvg: '',
              title: '我的发起',
              path: '/work-flow/my-initiate'
            }
          ]
        },
        {
          icon: 'pl-yonghuguanli',
          iconSvg: '',
          title: '用户管理',
          path: '/user',
          children: [
            {
              icon: 'pl-yonghu',
              iconSvg: '',
              title: '用户',
              path: '/user/User'
            },
            {
              icon: 'pl-yonghuzu',
              iconSvg: '',
              title: '用户组',
              path: '/user/UserGroup'
            },
            {
              icon: 'pl-weituoguanxiguanli',
              iconSvg: '',
              title: '用户/组关系',
              path: '/user/RelationGroup'
            },
            {
              icon: 'pl-tianjiayonghu',
              iconSvg: '',
              title: '批量添加用户',
              path: '/user/AddUser'
            },
            {
              icon: 'pl-tianjiayonghu1',
              iconSvg: '',
              title: '批量添加用户组',
              path: '/user/AddUserGroup'
            },
            {
              icon: 'pl-navicon-zhtdwh',
              iconSvg: '',
              title: '用户与用户组关系维护',
              path: '/user/RelationGroup'
            },
            {
              icon: 'pl-baimingdancelveweihu',
              iconSvg: '',
              title: '批量用户与用户组关系维护',
              path: '/user/BatchMaintain'
            }
          ]
        },
        {
          icon: 'pl-quanxianguanli2',
          iconSvg: '',
          title: '权限管理',
          path: '/permission',
          children: [
            {
              icon: 'pl-navicon-jsgl',
              iconSvg: '',
              title: '角色维护',
              path: '/permission/RoleMaintenance'
            },
            {
              icon: 'pl-shouquanguanli',
              iconSvg: '',
              title: '用户授权',
              path: '/permission/UserPermission'
            },
            {
              icon: 'pl-yonghudaoru',
              iconSvg: '',
              title: '批量角色导入/导出',
              path: '/permission/BatchImportRole'
            },
            {
              icon: 'pl-shouquan1',
              iconSvg: '',
              title: '批量用户授权',
              path: '/permission/BatchUserPermission'
            },
            {
              icon: 'pl-icon_Importcustomer',
              iconSvg: '',
              title: '批量用户组授权',
              path: '/permission/BatchGroupPermission'
            },
            {
              icon: 'pl-baobiao1',
              iconSvg: '',
              title: '报表统计',
              path: '/permission/Report'
            },
            {
              icon: 'pl-shouquanweituoshu',
              iconSvg: '',
              title: '用户授权管理',
              path: '/permission/UserPermission'
            },
            {
              icon: 'pl-quanxianguanli1',
              iconSvg: '',
              title: '批量角色维护',
              path: '/permission/BatchRoleMaintain'
            },
            {
              icon: 'pl-chaxun',
              iconSvg: '',
              title: '批量用户/用户组授权查询',
              path: '/permission/BatchQuery'
            }
          ]
        },
        {
          icon: 'pl-icon',
          iconSvg: '',
          title: '集成服务',
          path: '/integration',
          children: [
            {
              icon: 'pl-shujujicheng',
              iconSvg: '',
              title: '集成适配器',
              path: '/integration/Adapter'
            },
            {
              icon: 'pl-shujuku1',
              iconSvg: '',
              title: '数据库连接',
              path: '/integration/Database'
            },
            {
              icon: 'pl-navicon-xxwh',
              iconSvg: '',
              title: '服务分类',
              path: '/integration/ScvCate'
            },
            {
              icon: 'pl-servicehis',
              iconSvg: '',
              title: '业务服务',
              path: '/integration/Business'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('sysStore/menu', [
      // 'aside',
      'asideCollapse'
    ])
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse (val) {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    },
    // 监听路由 控制侧边栏激活状态
    '$route': {
      handler ({ fullPath }) {
        this.active = fullPath
        this.$nextTick(() => {
          if (this.aside.length > 0 && this.$refs.menu) {
            this.$refs.menu.activeIndex = fullPath
          }
        })
      },
      immediate: true
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy () {
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep li.el-menu-item {
    padding-left: 28px !important;
  }
  ::v-deep .el-submenu__title {
    font-size: 15px;
    font-weight: 400;
  }
  ::v-deep .el-submenu__title {
    padding-left: 20px !important;
    .iconfont {
      font-size: 17px !important;
    }
    span {
      display: inline-block;
      margin-left: 3px;
    }
  }
</style>
