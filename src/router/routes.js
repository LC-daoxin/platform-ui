import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'dashboard' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: '首页',
          auth: true
        },
        component: _import('system/dashboard')
      },
      // 系统 前端日志
      {
        path: 'syslog',
        name: 'syslog',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  },
  // iframe
  {
    path: '/myiframe',
    redirect: '/myiframe',
    component: layoutHeaderAside,
    children: [
      {
        path: ':routerPath',
        name: 'iframe',
        meta: {
          auth: true,
          title: 'iframe'
        },
        component: () => import('@/views/system/iframe')
      }
    ]
  },
  {
    path: '/admin',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '系统管理'
    },
    children: [
      // {
      //   path: 'user',
      //   name: 'user',
      //   meta: {
      //     auth: true,
      //     title: '用户管理'
      //   },
      //   component: () => import('@/views/syplatform/admin/user')
      // },
      {
        path: 'menu',
        name: 'menu',
        meta: {
          auth: true,
          title: '菜单管理'
        },
        component: () => import('@/views/syplatform/admin/menu')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          auth: true,
          title: '角色管理'
        },
        component: () => import('@/views/syplatform/admin/role')
      },
      {
        path: 'auth',
        name: 'auth',
        meta: {
          auth: true,
          title: '权限管理'
        },
        component: () => import('@/views/syplatform/admin/auth')
      },
      {
        path: 'log',
        name: 'log',
        meta: {
          auth: true,
          title: '日志管理'
        },
        component: () => import('@/views/syplatform/admin/log')
      },
      {
        path: 'dict',
        name: 'dict',
        meta: {
          auth: true,
          title: '字典管理'
        },
        component: () => import('@/views/syplatform/admin/dict')
      },
      {
        path: 'dept',
        name: 'dept',
        meta: {
          auth: true,
          title: '部门管理'
        },
        component: () => import('@/views/syplatform/admin/dept')
      },
      {
        path: 'route',
        name: 'route',
        meta: {
          auth: true,
          title: '路由管理'
        },
        component: () => import('@/views/syplatform/admin/route')
      },
      {
        path: 'client',
        name: 'client',
        meta: {
          auth: true,
          title: '客户端管理'
        },
        component: () => import('@/views/syplatform/admin/client')
      },
      {
        path: 'tenant',
        name: 'tenant',
        meta: {
          auth: true,
          title: '租户管理'
        },
        component: () => import('@/views/syplatform/admin/tenant')
      },
      {
        path: 'position',
        name: 'position',
        meta: {
          auth: true,
          title: '职位管理'
        },
        component: () => import('@/views/syplatform/admin/position')
      },
      {
        path: 'usergroup',
        name: 'usergroup',
        meta: {
          auth: true,
          title: '用户组管理'
        },
        component: () => import('@/views/syplatform/admin/usergroup')
      }
    ]
  },
  {
    path: '/user',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '用户管理'
    },
    children: [
      {
        path: 'User',
        name: 'User',
        meta: {
          auth: true,
          title: '用户'
        },
        component: () => import('@/views/user/User')
      },
      {
        path: 'UserGroup',
        name: 'UserGroup',
        meta: {
          auth: true,
          title: '用户组'
        },
        component: () => import('@/views/user/UserGroup')
      },
      {
        path: 'RelationGroup',
        name: 'RelationGroup',
        meta: {
          auth: true,
          title: '用户/组关系'
        },
        component: () => import('@/views/user/RelationGroup')
      },
      {
        path: 'AddUser',
        name: 'AddUser',
        meta: {
          auth: true,
          title: '批量添加用户'
        },
        component: () => import('@/views/user/AddUser')
      },
      {
        path: 'AddUserGroup',
        name: 'AddUserGroup',
        meta: {
          auth: true,
          title: '批量添加用户组'
        },
        component: () => import('@/views/user/User')
      },
      {
        path: 'BatchMaintain',
        name: 'BatchMaintain',
        meta: {
          auth: true,
          title: '批量用户与用户组关系维护'
        },
        component: () => import('@/views/user/BatchMaintain')
      }
    ]
  },
  {
    path: '/permission',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '权限管理'
    },
    children: [
      {
        path: 'RoleMaintenance',
        name: 'RoleMaintenance',
        meta: {
          auth: true,
          title: '角色维护'
        },
        component: () => import('@/views/permission/RoleMaintenance')
      },
      {
        path: 'UserPermission',
        name: 'UserPermission',
        meta: {
          auth: true,
          title: '用户授权'
        },
        component: () => import('@/views/permission/UserPermission')
      },
      {
        path: 'BatchImportRole',
        name: 'BatchImportRole',
        meta: {
          auth: true,
          title: '批量角色导入/导出'
        },
        component: () => import('@/views/permission/BatchImportRole')
      },
      {
        path: 'BatchUserPermission',
        name: 'BatchUserPermission',
        meta: {
          auth: true,
          title: '批量用户授权'
        },
        component: () => import('@/views/permission/BatchUserPermission')
      },
      {
        path: 'BatchGroupPermission',
        name: 'BatchGroupPermission',
        meta: {
          auth: true,
          title: '批量用户组授权'
        },
        component: () => import('@/views/permission/BatchGroupPermission')
      },
      {
        path: 'BatchRoleMaintain',
        name: 'BatchRoleMaintain',
        meta: {
          auth: true,
          title: '批量角色维护'
        },
        component: () => import('@/views/permission/BatchRoleMaintain')
      },
      {
        path: 'BatchQuery',
        name: 'BatchQuery',
        meta: {
          auth: true,
          title: '批量用户/用户组授权查询'
        },
        component: () => import('@/views/permission/BatchQuery')
      },
      {
        path: 'Report',
        name: 'Report',
        meta: {
          auth: true,
          title: '报表统计'
        },
        component: () => import('@/views/permission/Report')
      }
    ]
  },
  {
    path: '/integration',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '集成服务'
    },
    children: [
      {
        path: 'Adapter',
        name: 'Adapter',
        meta: {
          auth: true,
          title: '集成适配器'
        },
        component: () => import('@/views/integration/Adapter')
      },
      {
        path: 'Database',
        name: 'Database',
        meta: {
          auth: true,
          title: '数据库连接'
        },
        component: () => import('@/views/integration/Database')
      },
      {
        path: 'ScvCate',
        name: 'ScvCate',
        meta: {
          auth: true,
          title: '服务分类'
        },
        component: () => import('@/views/integration/ScvCate')
      },
      {
        path: 'Business',
        name: 'Business',
        meta: {
          auth: true,
          title: '业务服务'
        },
        component: () => import('@/views/integration/Business')
      }
    ]
  },
  {
    path: '/sy-admin',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '服务管理'
    },
    children: [
      {
        path: 'sy-api',
        name: 'sy-api',
        meta: {
          auth: true,
          title: '接口文档'
        },
        component: () => import('@/views/syplatform/service/swagger')
      },
      {
        path: 'sy-governance',
        name: 'sy-governance',
        meta: {
          auth: true,
          title: '服务治理'
        },
        component: () => import('@/views/syplatform/service/governance')
      },
      {
        path: 'sy-sentinel',
        name: 'sy-sentinel',
        meta: {
          auth: true,
          title: 'Sentinel 控制台'
        },
        component: () => import('@/views/syplatform/service/sentinel')
      }
    ]
  },
  {
    path: '/work-flow',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '工作流'
    },
    children: [
      {
        path: 'process-catalog',
        name: 'process-catalog',
        meta: {
          auth: true,
          title: '流程目录'
        },
        component: () => import('@/views/ProcessCatalog')
      },
      {
        path: 'process-management',
        name: 'process-management',
        meta: {
          auth: true,
          title: '流程管理'
        },
        component: () => import('@/views/ProcessManagement')
      },
      {
        path: 'mail-template',
        name: 'mail-template',
        meta: {
          auth: true,
          title: '邮件模板'
        },
        component: () => import('@/views/MailTemplate')
      },
      {
        path: 'template-style',
        name: 'template-style',
        meta: {
          auth: true,
          title: '模板样式'
        },
        component: () => import('@/views/TemplateStyle')
      },
      {
        path: 'process-design',
        name: 'process-design',
        meta: {
          auth: true,
          title: '流程设计'
        },
        component: () => import('@/views/ProcessDesign')
      },
      {
        path: 'my-todo',
        name: 'my-todo',
        meta: {
          auth: true,
          title: '我的待办'
        },
        component: () => import('@/views/MyTodo')
      },
      {
        path: 'my-proxy',
        name: 'my-proxy',
        meta: {
          auth: true,
          title: '我的代理'
        },
        component: () => import('@/views/MyProxy')
      },
      {
        path: 'my-done',
        name: 'my-done',
        meta: {
          auth: true,
          title: '我的已办'
        },
        component: () => import('@/views/MyDone')
      },
      {
        path: 'my-request',
        name: 'my-request',
        meta: {
          auth: true,
          title: '我的申请'
        },
        component: () => import('@/views/MyRequest')
      },
      {
        path: 'my-initiate',
        name: 'my-initiate',
        meta: {
          auth: true,
          title: '我的发起'
        },
        component: () => import('@/views/MyInitiate')
      },
      {
        path: 'app-certification-reg',
        name: 'app-certification-reg',
        meta: {
          auth: true,
          title: '应用认证注册'
        },
        component: () => import('@/views/AppCertificationReg')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
