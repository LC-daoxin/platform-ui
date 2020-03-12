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
          icon: '',
          iconSvg: '',
          title: '工作流',
          path: '',
          children: [
            {
              icon: '',
              iconSvg: '',
              title: '流程管理',
              path: '/work-flow/process-admin'
            },
            {
              icon: '',
              iconSvg: '',
              title: '流程目录',
              path: '/work-flow/process-catalog'
            }
          ]
        },
        {
          icon: '',
          iconSvg: '',
          title: '用户管理',
          path: '/user',
          children: [
            {
              icon: '',
              iconSvg: '',
              title: '用户',
              path: '/user/User'
            },
            {
              icon: '',
              iconSvg: '',
              title: '用户组',
              path: '/user/UserGroup'
            },
            {
              icon: '',
              iconSvg: '',
              title: '用户/组关系',
              path: '/user/RelationGroup'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量添加用户',
              path: '/user/AddUser'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量添加用户组',
              path: '/user/AddUserGroup'
            },
            {
              icon: '',
              iconSvg: '',
              title: '用户与用户组关系维护',
              path: '/user/RelationGroup'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量用户与用户组关系维护',
              path: '/user/BatchMaintain'
            }
          ]
        },
        {
          icon: '',
          iconSvg: '',
          title: '权限管理',
          path: '/permission',
          children: [
            {
              icon: '',
              iconSvg: '',
              title: '角色维护',
              path: '/permission/RoleMaintenance'
            },
            {
              icon: '',
              iconSvg: '',
              title: '用户授权',
              path: '/permission/UserPermission'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量角色导入/导出',
              path: '/permission/BatchImportRole'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量用户授权',
              path: '/permission/BatchUserPermission'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量用户组授权',
              path: '/permission/BatchGroupPermission'
            },
            {
              icon: '',
              iconSvg: '',
              title: '报表统计',
              path: '/permission/Report'
            },
            {
              icon: '',
              iconSvg: '',
              title: '用户授权管理',
              path: '/permission/UserPermission'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量角色维护',
              path: '/permission/BatchRoleMaintain'
            },
            {
              icon: '',
              iconSvg: '',
              title: '批量用户/用户组授权查询',
              path: '/permission/BatchQuery'
            }
          ]
        },
        {
          icon: '',
          iconSvg: '',
          title: '集成服务',
          path: '/integration',
          children: [
            {
              icon: '',
              iconSvg: '',
              title: '集成适配器',
              path: '/integration/Adapter'
            },
            {
              icon: '',
              iconSvg: '',
              title: '数据库连接',
              path: '/integration/Database'
            },
            {
              icon: '',
              iconSvg: '',
              title: '服务分类',
              path: '/integration/ScvCate'
            },
            {
              icon: '',
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
