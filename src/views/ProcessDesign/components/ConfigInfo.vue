<template>
  <div class="config-info">
    <!--<h4>扩展节点基本信息</h4>-->
    <!--<section>-->
      <!--<span class="title">扩展节点基本信息：</span>-->
      <!--<el-input size="mini" style="width:150px;margin-right:10px"></el-input>-->
      <!--<el-button type="primary" size="mini">保存扩展节点</el-button>-->
    <!--</section>-->
    <h4>扩展节点规则</h4>
    <h5>前置条件</h5>
    <el-table class="table" :data="precondition" size="mini" border>
      <el-table-column
        prop="connectRelation"
        label="关联关系"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.relativeFormula"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="左括号"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.leftBracket"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="条件表达式"
        align="center"
        width="230"
      >
        <template>
          <div class="cell-co">
            <el-select v-model="value" placeholder="请选择" size="mini" class="selectL">
              <el-option
                v-for="item in options.leftContentType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" placeholder="请选择" size="mini" class="selectR">
              <el-option
                v-for="item in options.leftContent"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="比较公式"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.compareFormula"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="结果表达式"
        align="center"
        width="260"
      >
        <template>
          <div class="cell-co">
            <el-select v-model="value" placeholder="请选择" size="mini" class="selectL">
              <el-option
                v-for="item in options.relativeFormula"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input size="mini"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="右括号"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.relativeFormula"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80"
      >
        <template>
          <el-button type="primary" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>表达式</p>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      size="mini">
    </el-input>
    <h5>后置条件</h5>
    <el-table class="table" :data="precondition" size="mini" border>
      <el-table-column
        prop="connectRelation"
        label="关联关系"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.relativeFormula"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="左括号"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.leftBracket"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="条件表达式"
        align="center"
        width="230"
      >
        <template>
          <div class="cell-co">
            <el-select v-model="value" placeholder="请选择" size="mini" class="selectL">
              <el-option
                v-for="item in options.leftContentType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" placeholder="请选择" size="mini" class="selectR">
              <el-option
                v-for="item in options.leftContent"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="比较公式"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.compareFormula"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="结果表达式"
        align="center"
        width="260"
      >
        <template>
          <div class="cell-co">
            <el-select v-model="value" placeholder="请选择" size="mini" class="selectL">
              <el-option
                v-for="item in options.relativeFormula"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input size="mini"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="右括号"
        align="center"
        width="110"
      >
        <template>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options.relativeFormula"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80"
      >
        <template>
          <el-button type="primary" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>表达式</p>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      size="mini">
    </el-input>
    <h5>扩展节点审批人</h5>
    <header>
      <el-select v-model="value" placeholder="请选择" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="mini" type="primary">添加审批人</el-button>
    </header>
    <el-table size="mini" border></el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      condition: 'Express',
      conditionTitle: '申请人AD',
      result: 'Consta',
      approverType: 'User',
      precondition: [
        {}
      ],
      options: {
        relativeFormula: [{ // 关联关系
          value: 1,
          label: 'And'
        },{
          value: 2,
          label: 'Or'
        }],
        leftBracket: [{ // 左括号
          value: 1,
          label: '('
        },{
          value: 2,
          label: '(('
        },{
          value: 3,
          label: '((('
        },{
          value: 4,
          label: '(((('
        }],
        leftContentType: [{ // 左值类型
          value: 1,
          label: 'Constant'
        },{
          value: 2,
          label: 'Expression'
        }],
        leftContent: [{ // 左值表达式
          value: '申请人AD',
          label: '申请人AD'
        },{
          value: '申请人公司ID',
          label: '申请人公司ID'
        },{
          value: '申请人公司名称',
          label: '申请人公司名称'
        },{
          value: '申请人部门ID',
          label: '申请人部门ID'
        },{
          value: '申请人部门名称',
          label: '申请人部门名称'
        },{
          value: '申请人邮箱',
          label: '申请人邮箱'
        },{
          value: '申请人ID',
          label: '申请人ID'
        },{
          value: '申请人手机',
          label: '申请人手机'
        },{
          value: '申请人姓名',
          label: '申请人姓名'
        },{
          value: '申请人电话',
          label: '申请人电话'
        },{
          value: '申请人职位',
          label: '申请人职位'
        },{
          value: '申请ID',
          label: '申请ID'
        },{
          value: '申请流水号',
          label: '申请流水号'
        },{
          value: '申请状态',
          label: '申请状态'
        },{
          value: '申请主题',
          label: '申请主题'
        },{
          value: '控制点ID',
          label: '控制点ID'
        },{
          value: '创建人',
          label: '创建人'
        },{
          value: '创建时间',
          label: '创建时间'
        },{
          value: '删除标示',
          label: '删除标示'
        },{
          value: '描述',
          label: '描述'
        },{
          value: '审批策略ID',
          label: '审批策略ID'
        },{
          value: '流程ID',
          label: '流程ID'
        },{
          value: '引用流程ID',
          label: '引用流程ID'
        },{
          value: '流程实例ID',
          label: '流程实例ID'
        },{
          value: '更新人',
          label: '更新人'
        },{
          value: '更新时间',
          label: '更新时间'
        }],
        compareFormula: [{ // 比较公式
          value: 1,
          label: '='
        },{
          value: 2,
          label: '>'
        },{
          value: 3,
          label: '>='
        },{
          value: 4,
          label: '<'
        },{
          value: 5,
          label: '<='
        },{
          value: 6,
          label: '<>'
        },{
          value: 7,
          label: 'In'
        },{
          value: 8,
          label: 'Not In'
        },{
          value: 9,
          label: 'Like'
        },{
          value: 10,
          label: 'Not'
        }]
      },
      value: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .config-info {
    padding: 0 10px 20px;
    h4 {
      margin-top: 5px;
    }
    section {
      padding: 0 10px;
      .title {
        font-size: 12px;
      }
    }
    p {
      font-size: 12px;
      font-weight: bold;
    }
    header {
      margin-bottom: 10px;
    }
  }
  .table {
    .cell-co {
      display: flex;
      .selectL {
        margin-right: 10px;
        width:100px
      }
      .selectR {
        width:130px
      }
    }
  }
</style>
