<template>
  <div class="config-info">
    <!--<h4>扩展节点基本信息</h4>-->
    <!--<section>-->
      <!--<span class="title">扩展节点基本信息：</span>-->
      <!--<el-input size="mini" style="width:150px;margin-right:10px"></el-input>-->
      <!--<el-button type="primary" size="mini">保存扩展节点</el-button>-->
    <!--</section>-->
    <h3>扩展节点规则</h3>
    <div class="model-box">
      <h5 class="h5">前置条件</h5>
      <div class="bar">
        <el-row>
          <el-col :span="24">
            <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" :loading="addloading1" @click="addRule((PrecedingData.length + 1), 1)">添加一条</el-button>
            <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" :loading="insertloading1" @click="insertRule(1)">向前插入一条</el-button>
            <!--<el-button class="filter-item btnMini" type="success" size="mini" icon="el-icon-lock">保存表达式</el-button>-->
            <el-button class="filter-item btnMini" type="danger" size="mini" icon="el-icon-minus" @click="deleteRule('all', 1)">删除全部</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        class="table"
        ref="PrecedingTable"
        :data="PrecedingData"
        v-loading="Precedingloading"
        highlight-current-row
        @selection-change="handleSelectionChange"
        size="mini"
        border
      >
        <el-table-column
          type="selection"
          align="center"
          min-width="42">
        </el-table-column>
        <el-table-column label="关联关系" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relativeFormula" placeholder="请选择" size="mini" @change="updateRule(scope.row, 1)">
              <el-option
                v-for="item in options.relativeFormula"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="左括号" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.leftBracket" placeholder="请选择" size="mini" @change="updateRule(scope.row, 1)">
              <el-option
                v-for="item in options.leftBracket"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件表达式(表达式需要用单引号括起来,不能为空)" align="center" width="350">
          <template slot-scope="scope">
            <div class="cell-co">
              <el-select v-model="scope.row.leftContentType" placeholder="请选择" size="mini" class="selectL" @change="updateRule(scope.row, 1)">
                <el-option
                  v-for="item in options.leftContentType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-if="scope.row.leftContentType === 1" v-model="scope.row.leftContent" placeholder="请选择" size="mini" class="selectR" @change="updateRule(scope.row, 1)">
                <el-option
                  v-for="item in options.leftContent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-else class="input" size="mini" v-model="scope.row.leftContent" @blur="updateRule(scope.row, 1)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="比较公式" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.compareFormula" placeholder="请选择" size="mini" @change="updateRule(scope.row, 1)">
              <el-option
                v-for="item in options.compareFormula"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结果表达式(表达式需要用单引号括起来,不能为空)" align="center" width="350">
          <template slot-scope="scope">
            <div class="cell-co">
              <el-select v-model="scope.row.rightContentType" placeholder="请选择" size="mini" class="selectL" @change="updateRule(scope.row, 1)">
                <el-option
                  v-for="item in options.rightContentType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-if="scope.row.rightContentType === 1" v-model="scope.row.rightContent" placeholder="请选择" size="mini" class="selectR" @change="updateRule(scope.row, 1)">
                <el-option
                  v-for="item in options.rightContent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-else class="input" size="mini" v-model="scope.row.rightContent" @blur="updateRule(scope.row, 1)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="右括号" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rightBracket" placeholder="请选择" size="mini" @change="updateRule(scope.row, 1)">
              <el-option
                v-for="item in options.rightBracket"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRule(scope.row.businessRuleID, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <h5>表达式</h5>
      <el-input v-model="PrecedingString" type="textarea" :rows="3" placeholder="请输入内容" size="mini"></el-input>
    </div>
    <div class="model-box">
      <h5 class="h5">后置条件</h5>
      <div class="bar">
        <el-row>
          <el-col :span="24">
            <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" :loading="addloading2" @click="addRule((EndingData.length + 1), 2)">添加一条</el-button>
            <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" :loading="insertloading2" @click="insertRule(2)">向前插入一条</el-button>
            <!--<el-button class="filter-item btnMini" type="success" size="mini" icon="el-icon-lock">保存表达式</el-button>-->
            <el-button class="filter-item btnMini" type="danger" size="mini" icon="el-icon-minus" @click="deleteRule('all', 2)">删除全部</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        class="table"
        ref="EndingTable"
        :data="EndingData"
        v-loading="Endingloading"
        highlight-current-row
        @selection-change="handleSelectionChange"
        size="mini"
        border
      >
        <el-table-column
          type="selection"
          align="center"
          min-width="42">
        </el-table-column>
        <el-table-column label="关联关系" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relativeFormula" placeholder="请选择" size="mini" @change="updateRule(scope.row, 2)">
              <el-option
                v-for="item in options.relativeFormula"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="左括号" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.leftBracket" placeholder="请选择" size="mini" @change="updateRule(scope.row, 2)">
              <el-option
                v-for="item in options.leftBracket"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件表达式(表达式需要用单引号括起来,不能为空)" align="center" width="350">
          <template slot-scope="scope">
            <div class="cell-co">
              <el-select v-model="scope.row.leftContentType" placeholder="请选择" size="mini" class="selectL" @change="updateRule(scope.row, 2)">
                <el-option
                  v-for="item in options.leftContentType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-if="scope.row.leftContentType === 1" v-model="scope.row.leftContent" placeholder="请选择" size="mini" class="selectR" @change="updateRule(scope.row, 2)">
                <el-option
                  v-for="item in options.leftContent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-else class="input" size="mini" v-model="scope.row.leftContent" @blur="updateRule(scope.row, 2)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="比较公式" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.compareFormula" placeholder="请选择" size="mini" @change="updateRule(scope.row, 2)">
              <el-option
                v-for="item in options.compareFormula"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结果表达式(表达式需要用单引号括起来,不能为空)" align="center" width="350">
          <template slot-scope="scope">
            <div class="cell-co">
              <el-select v-model="scope.row.rightContentType" placeholder="请选择" size="mini" class="selectL" @change="updateRule(scope.row, 2)">
                <el-option
                  v-for="item in options.rightContentType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-if="scope.row.rightContentType === 1" v-model="scope.row.rightContent" placeholder="请选择" size="mini" class="selectR" @change="updateRule(scope.row, 2)">
                <el-option
                  v-for="item in options.rightContent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-else class="input" size="mini" v-model="scope.row.rightContent" @blur="updateRule(scope.row, 2)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="右括号" align="center" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rightBracket" placeholder="请选择" size="mini" @change="updateRule(scope.row, 2)">
              <el-option
                v-for="item in options.rightBracket"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRule(scope.row.businessRuleID, 2)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <h5>表达式</h5>
      <el-input v-model="EndingString" type="textarea" :rows="3" placeholder="请输入内容" size="mini"></el-input>
    </div>
    <div class="model-box">
      <h5 class="h5">扩展节点审批人</h5>
      <header v-if="showDestination">
        <el-select v-model="destinationTypeValue" placeholder="请选择" size="mini" style="margin-right: 10px">
          <el-option
            v-for="item in options.destinationType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="addDestination">添加审批人</el-button>
      </header>
      <el-table
        v-if="showDestination"
        class="table"
        ref="NodeApproverTable"
        :data="NodeApproverData"
        v-loading="NodeApproverloading"
        highlight-current-row
        size="mini"
        border
      >
        <el-table-column label="序号" align="center" width="45">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规则" align="center" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.destinationExpression }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置类型" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.destinationType | destinationType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="96">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDestination(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDestination(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-card class="box-card" v-if="!showDestination">
        <h5>前置条件</h5>
        <div class="bar">
          <el-row>
            <el-col :span="24">
              <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" @click="addDestinationRule">添加一条</el-button>
              <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" @click="insertDestinationRule">向前插入一条</el-button>
              <el-button class="filter-item btnMini" type="danger" size="mini" icon="el-icon-minus" @click="DestinationData = []">删除全部</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table
          class="table"
          ref="DestinationTable"
          :data="DestinationData"
          v-loading="Destinationloading"
          highlight-current-row
          @selection-change="handleSelectionChange"
          size="mini"
          border
        >
          <el-table-column
            type="selection"
            align="center"
            min-width="42">
          </el-table-column>
          <el-table-column label="关联关系" align="center" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.relativeFormula" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options.relativeFormula"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="左括号" align="center" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.leftBracket" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options.leftBracket"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="条件表达式(表达式需要用单引号括起来,不能为空)" align="center" width="350">
            <template slot-scope="scope">
              <div class="cell-co">
                <el-select v-model="scope.row.leftContentType" placeholder="请选择" size="mini" class="selectL">
                  <el-option
                    v-for="item in options.leftContentType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-if="scope.row.leftContentType === 1" v-model="scope.row.leftContent" placeholder="请选择" size="mini" class="selectR">
                  <el-option
                    v-for="item in options.leftContent"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-else class="input" size="mini" v-model="scope.row.leftContent"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="比较公式" align="center" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.compareFormula" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options.compareFormula"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="结果表达式(表达式需要用单引号括起来,不能为空)" align="center" width="350">
            <template slot-scope="scope">
              <div class="cell-co">
                <el-select v-model="scope.row.rightContentType" placeholder="请选择" size="mini" class="selectL">
                  <el-option
                    v-for="item in options.rightContentType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-if="scope.row.rightContentType === 1" v-model="scope.row.rightContent" placeholder="请选择" size="mini" class="selectR">
                  <el-option
                    v-for="item in options.rightContent"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-else class="input" size="mini" v-model="scope.row.rightContent"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="右括号" align="center" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.rightBracket" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options.rightBracket"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="60">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDestinationRule(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="showString">
          <h5>表达式</h5>
          <el-input v-model="DestinationString" type="textarea" :rows="3" placeholder="请输入内容" size="mini" disabled></el-input>
        </div>
        <h5>审批人列表</h5>
        <div class="bar">
          <el-row>
            <el-col :span="24">
              <el-button class="filter-item btnMini" type="primary" size="mini" icon="el-icon-plus" @click="openApprover">添加审批人</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table
          class="table"
          ref="ApproverTable"
          :data="ApproverData"
          v-loading="Approverloading"
          highlight-current-row
          size="mini"
          border
        >
          <el-table-column label="序号" align="center" min-width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.ACCOUNT }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" align="center" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.MOBILE }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="90">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteApprover(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-row>
            <el-col :span="24" class="col">
              <el-button v-if="!showString" class="filter-item btnMini" type="primary" size="mini" @click="affirmDestination">确认</el-button>
              <el-button v-else class="filter-item btnMini" type="primary" size="mini" @click="updataDestination">确认</el-button>
              <el-button class="filter-item btnMini" size="mini" @click="closeDestination" >取消</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 添加审批人-弹窗 -->
    <add-approver
      @showDialog="closeDialog"
      @Approver="getApproverList"
      :dialogApproverVisible="dialogApproverVisible"
      ref="AddApprover"
    />
    <!-- 添加审批人-弹窗 -->
  </div>
</template>

<script>
import AddApprover from './AddApprover'
import { mapState } from 'vuex'
export default {
  components: {
    AddApprover
  },
  data () {
    return {
      node: null, // 节点数据
      options: {
        relativeFormula: [{ // 关联关系
          value: 1,
          label: 'And'
        }, {
          value: 2,
          label: 'Or'
        }],
        leftBracket: [{ // 左括号
          value: 1,
          label: '('
        }, {
          value: 2,
          label: '(('
        }, {
          value: 3,
          label: '((('
        }, {
          value: 4,
          label: '(((('
        }],
        leftContentType: [{ // 左值类型
          value: 1,
          label: 'Expression'
        }, {
          value: 2,
          label: 'Constant'
        }],
        leftContent: [{ // 左值表达式
          value: "'申请人AD'",
          label: '申请人AD'
        }, {
          value: "'申请人公司ID'",
          label: '申请人公司ID'
        }],
        compareFormula: [{ // 比较公式
          value: 1,
          label: '='
        }, {
          value: 2,
          label: '>'
        }, {
          value: 3,
          label: '>='
        }, {
          value: 4,
          label: '<'
        }, {
          value: 5,
          label: '<='
        }, {
          value: 6,
          label: '<>'
        }, {
          value: 7,
          label: 'In'
        }, {
          value: 8,
          label: 'Not In'
        }, {
          value: 9,
          label: 'Like'
        }, {
          value: 10,
          label: 'Not'
        }],
        rightContentType: [{ // 右值类型
          value: 1,
          label: 'Expression'
        }, {
          value: 2,
          label: 'Constant'
        }],
        rightContent: [{ // 右值表达式
          value: "'申请人AD'",
          label: '申请人AD'
        }, {
          value: "'申请人公司ID'",
          label: '申请人公司ID'
        }],
        rightBracket: [{ // 右括号
          value: 1,
          label: ')'
        }, {
          value: 2,
          label: '))'
        }, {
          value: 3,
          label: ')))'
        }, {
          value: 4,
          label: '))))'
        }],
        destinationType: [{ // 选人模式
          value: 1,
          label: 'User'
        }, {
          value: 2,
          label: 'Configuration'
        }]
      },
      PrecedingData: [], // 节点前置规则数据
      EndingData: [], // 节点后置规则数据
      DestinationData: [], // 节点选人规则数据
      NodeApproverData: [], // 节点审批人数据
      ApproverData: [], // 审批人选择table
      PrecedingString: '', // 节点前置表达式
      EndingString: '', // 节点后置表达式
      DestinationString: '', // 节点选人表达式
      Precedingloading: false,
      Endingloading: false,
      Destinationloading: false,
      NodeApproverloading: false,
      Approverloading: false,
      addloading1: false, // 添加按钮loading
      insertloading1: false, // 插入按钮loading
      addloading2: false, // 添加按钮loading
      insertloading2: false, // 插入按钮loading
      multipleSelection1: '', // 多选 节点前置
      multipleSelection2: '', // 多选 节点后置
      multipleSelection3: '', // 多选 节点选人
      currentRow1: null, // 当前行 节点前置
      currentRow2: null, // 当前行 节点后置
      currentRow3: null, // 当前行 节点选人
      destinationTypeValue: 1, // 选人模式 1 User 2 Configuration 默认1
      showDestination: true, // 选择审批人规则 显示隐藏
      showString: false, // 审批人规则表达式与确实（更新） 显示隐藏
      currentDestination: null, // 当前编辑审批人规则
      dialogApproverVisible: false,
      userIdList: [] // 审批人选择用户ID
    }
  },
  filters: {
    destinationType (Type) {
      if (Type === 1) {
        return 'User'
      } else if (Type === 2) {
        return 'Configuration'
      }
    }
  },
  computed: {
    ...mapState('sysStore/processConfig', [
      'configDate'
    ])
  },
  methods: {
    init (node) {
      this.node = node
      this.getInfo('NodePrecedingRule', node) // 节点前置规则
      this.getInfo('NodeEndingRule', node) // 节点后置规则
      this.getDestinationData(node) // 审批人规则
    },
    // 根据节点Id查询规则接口  NodePrecedingRule 节点前置规则  NodeEndingRule 节点后置规则  DestinationRule 选人规则
    getInfo (type, node) {
      if (type === 'NodePrecedingRule') {
        this.Precedingloading = true
      } else if (type === 'NodeEndingRule') {
        this.Endingloading = true
      }
      this.getRuleExpressionString(type, node) // 获取表达式
      this.axios_M4.get(`/rule/${type}/${node.nodeId}`)
        .then(res => {
          let data = res.data
          if (data.code === 'success') {
            data.data.sort((a, b) => a.conditionOrder - b.conditionOrder) // 根据conditionOrder 排序
            console.log(`获取${type}规则`, data.data)
            if (type === 'NodePrecedingRule') {
              this.PrecedingData = data.data // table
              this.Precedingloading = false
              this.btnLoading('add', 1, false)
              this.btnLoading('insert', 1, false)
            } else if (type === 'NodeEndingRule') {
              this.EndingData = data.data // table
              this.Endingloading = false
              this.btnLoading('add', 2, false)
              this.btnLoading('insert', 2, false)
            }
          }
        })
    },
    // 获取审批人规则列表
    getDestinationData (node) {
      this.axios_M4.get(`/destination/list/${node.nodeId}`)
        .then(res => {
          console.log('获取审批人规则', res)
          let data = res.data
          if (data.code === 'success') {
            this.NodeApproverData = data.data // table
          }
        })
    },
    // 新增规则
    /**
     * @Order 排序位置
     * @objectType 表达式类型 1:节点前置规则 2:节点后置规则 3:选人规则
     * */
    addRule (Order, objectType) {
      this.btnLoading('add', objectType, true)
      let data = {
        objectID: this.node.nodeId, // 表达式所属业务Id= 节点Id
        objectType: objectType,
        conditionOrder: Order, // 优先级 排序
        compareFormula: 1, // 比较符
        leftBracket: 1, // 左括号
        leftContent: "''", // 左值表达式
        leftContentType: 1, // 左值类型
        relativeFormula: 1, // 关联关系
        rightBracket: 1, // rightBracket
        rightContent: "''", // rightContent
        rightContentType: 1 // rightContentType
      }
      console.log(data)
      this.axios_M4.post(`/rule/`, data).then((res) => {
        if (res.data.code === 'success') {
          // this.$message({
          //   type: 'success',
          //   message: res.data.msg
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
        this.refresh(objectType) // 刷新
      }).catch((err) => {
        console.log(err)
      })
    },
    // 向前插入
    insertRule (type) {
      let multipleSelection
      if (type === 1) {
        multipleSelection = this.multipleSelection1
      } else if (type === 2) {
        multipleSelection = this.multipleSelection2
      }
      if (multipleSelection === '') {
        this.$message({
          type: 'warning',
          message: '请选择一条规则'
        })
      } else if (multipleSelection.indexOf(',') !== -1) {
        this.$message({
          type: 'warning',
          message: '只能选择一条规则进行插入'
        })
      } else {
        this.btnLoading('insert', type, true)
        let currentRow
        if (type === 1) {
          currentRow = this.currentRow1
        } else if (type === 2) {
          currentRow = this.currentRow2
        }
        let newArr
        if (type === 1) {
          newArr = [...this.PrecedingData]
        } else if (type === 2) {
          newArr = [...this.EndingData]
        }
        newArr.forEach(item => {
          if (item.conditionOrder >= currentRow.conditionOrder) { // 要插入的后面所有规则
            item.conditionOrder = item.conditionOrder + 1
            this.updateRule(item, type, false) // 更新后面的规则排序，但不刷新
          }
        })
        this.addRule(currentRow.conditionOrder - 1, type) // 新增规则
        if (type === 1) {
          this.multipleSelection1 = ''
        } else if (type === 2) {
          this.multipleSelection2 = ''
        }
      }
    },
    // 删除规则
    deleteRule (businessRuleID, Type) {
      if (businessRuleID === 'all') {
        if (Type === 1) {
          this.handleSelectionChange(this.PrecedingData)
          businessRuleID = this.multipleSelection1
        } else if (Type === 2) {
          this.handleSelectionChange(this.EndingData)
          businessRuleID = this.multipleSelection2
        }
      }
      this.$confirm(`确定要删除选择的规则?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/rule/${businessRuleID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.refresh(Type) // 刷新
              this.$message({
                type: 'success',
                message: '已删除'
              })
            }
            this.multipleSelection = ''
          })
      }).catch((res) => {
        console.log(res)
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 更新
    /**
     * @rule 当前需要更新的规则信息
     * @type 表达式类型：1:节点前置规则 2:节点后置规则 3:选人规则
     * @refresh 是否刷新table 默认刷新
     * */
    updateRule (rule, type, refresh = true) {
      let data = {
        businessRuleID: rule.businessRuleID,
        objectID: this.node.nodeId, // 表达式所属业务Id= 节点Id
        objectType: type, // 表达式类型 1:节点前置规则 2:节点后置规则 3:选人规则
        conditionOrder: rule.conditionOrder, // 优先级 排序
        compareFormula: rule.compareFormula, // 比较符
        leftBracket: rule.leftBracket, // 左括号
        leftContent: rule.leftContent, // 左值表达式
        leftContentType: rule.leftContentType, // 左值类型
        relativeFormula: rule.relativeFormula, // 关联关系
        rightBracket: rule.rightBracket, // rightBracket
        rightContent: rule.rightContent, // rightContent
        rightContentType: rule.rightContentType // rightContentType
      }
      this.axios_M4.put(`/rule/`, data).then((res) => {
        if (res.data.code === 'success') {
          // this.$message({
          //   type: 'success',
          //   message: '更新成功'
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
        if (refresh) {
          this.refresh(type) // 刷新
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取表达式, 并显示
    getRuleExpressionString (type, node) {
      this.axios_M4.get(`/rule/getRuleExpressionString/${type}/${node.nodeId}`)
        .then(res => {
          let data = res.data
          if (data.code === 'success') {
            if (type === 'NodePrecedingRule') {
              this.PrecedingString = data.data
            } else if (type === 'NodeEndingRule') {
              this.EndingString = data.data
            } else if (type === 'DestinationRule') {
              this.DestinationString = data.data
            }
          }
        })
    },
    // 添加审批人
    addDestination () {
      this.showString = false // 审批人规则表达式 隐藏
      this.showDestination = false
      this.DestinationData = []
    },
    // 编辑审批人配置
    editDestination (row) {
      this.currentDestination = row
      this.axios_M4.get(`/destination/${row.destinationID}`)
        .then(res => {
          let data = res.data.data
          console.log('编辑审批人配置', data)
          if (res.data.code === 'success') {
            this.DestinationString = data.destinationExpression
            this.showString = true // 审批人规则表达式 确认btn 显示
            this.showDestination = false
            this.DestinationData = data.ruleList
            this.userIdList = data.userIdList
            if (this.userIdList.length > 0) {
              this.userIdList.forEach(item => {
                this.ApproverData.push({
                  'ID': item,
                  'ACCOUNT': item,
                  'MOBILE': '模拟数据'
                })
              })
            }
          }
        })
    },
    // 删除审批人配置
    deleteDestination (row) {
      this.$confirm(`确定要删除选择的审批人配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/destination/${row.destinationID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.refresh(3) // 刷新
              this.$message({
                type: 'success',
                message: '已删除'
              })
            }
          })
      }).catch((res) => {
        console.log(res)
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 审批人确认
    affirmDestination () {
      let data = {
        destinationType: this.destinationTypeValue,
        nodeID: this.node.nodeId,
        ruleList: this.DestinationData,
        userIdList: this.userIdList
      }
      console.log(data)
      this.axios_M4.post(`/destination/`, data).then((res) => {
        console.log('添加审批人规则', res)
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
        this.showDestination = true
        this.userIdList = [] // 清空
        this.ApproverData = [] // 清空
        this.DestinationData = [] // 清空
        this.refresh(3) // 刷新
      }).catch((err) => {
        console.log(err)
      })
    },
    // 审批人更新
    updataDestination () {
      let data = {
        destinationID: this.currentDestination.destinationID,
        processConfigID: this.configDate.processConfigID,
        // destinationExpression: this.DestinationString,
        destinationType: this.destinationTypeValue,
        nodeID: this.node.nodeId,
        ruleList: this.DestinationData,
        userIdList: this.userIdList
      }
      console.log(data)
      this.axios_M4.put(`/destination/`, data).then((res) => {
        console.log('更新审批人规则', res)
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
        this.showDestination = true
        this.DestinationData = [] // 清空
        this.ApproverData = [] // 清空
        this.userIdList = [] // 清空
        this.refresh(3) // 刷新
      }).catch((err) => {
        console.log(err)
      })
    },
    // 审批人取消
    closeDestination () {
      this.showDestination = true
      this.currentDestination = null
      this.ApproverData = [] // 清空
      this.userIdList = [] // 清空
      this.refresh(3) // 刷新
    },
    // 新增选人规则
    /**
     * @Order 排序位置
     * @objectType 3:选人规则
     * */
    addDestinationRule () {
      let data = {
        // objectID: this.node.nodeId, // 表达式所属业务Id= 节点Id
        objectType: 3,
        conditionOrder: this.DestinationData.length + 1, // 优先级 排序
        compareFormula: 1, // 比较符
        leftBracket: 1, // 左括号
        leftContent: "''", // 左值表达式
        leftContentType: 1, // 左值类型
        relativeFormula: 1, // 关联关系
        rightBracket: 1, // rightBracket
        rightContent: "''", // rightContent
        rightContentType: 1 // rightContentType
      }
      this.DestinationData.push(data)
    },
    // 向前插入
    insertDestinationRule () {
      if (this.multipleSelection3 === '') {
        this.$message({
          type: 'warning',
          message: '请选择一条规则'
        })
      } else if (this.multipleSelection3.indexOf(',') !== -1) {
        this.$message({
          type: 'warning',
          message: '只能选择一条规则进行插入'
        })
      } else {
        let currentRow = this.currentRow3
        let data = {
          objectType: 3,
          conditionOrder: currentRow.conditionOrder, // 优先级 排序
          compareFormula: 1, // 比较符
          leftBracket: 1, // 左括号
          leftContent: "''", // 左值表达式
          leftContentType: 1, // 左值类型
          relativeFormula: 1, // 关联关系
          rightBracket: 1, // rightBracket
          rightContent: "''", // rightContent
          rightContentType: 1 // rightContentType
        }
        let newArr = [...this.DestinationData]
        newArr.forEach(item => {
          if (item.conditionOrder >= currentRow.conditionOrder) { // 要插入的后面所有规则
            item.conditionOrder = item.conditionOrder + 1
          }
        })
        newArr.splice(currentRow.conditionOrder - 2, 0, data)
        this.DestinationData = newArr
        this.multipleSelection3 = ''
      }
    },
    // 删除规则
    deleteDestinationRule (row, index) {
      this.$confirm(`确定要删除选择的规则?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DestinationData.splice(index, 1)
      }).catch((res) => {
        console.log(res)
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.businessRuleID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      if (val[0]) {
        if (val[0].objectType === 1) {
          this.multipleSelection1 = Str
          this.currentRow1 = val[0]
        } else if (val[0].objectType === 2) {
          this.multipleSelection2 = Str
          this.currentRow2 = val[0]
        } else if (val[0].objectType === 3) {
          this.multipleSelection3 = Str
          this.currentRow3 = val[0]
        }
      }
    },
    // 按钮加载
    btnLoading (btn, type, loading) {
      if (btn === 'add') {
        if (type === 1) {
          this.addloading1 = loading
        } else if (type === 2) {
          this.addloading2 = loading
        }
      } else if (btn === 'insert') {
        if (type === 1) {
          this.insertloading1 = loading
        } else if (type === 2) {
          this.insertloading2 = loading
        }
      }
    },
    // 刷新Table
    refresh (type) {
      if (type === 1) {
        this.getInfo('NodePrecedingRule', this.node) // 节点前置规则
      } else if (type === 2) {
        this.getInfo('NodeEndingRule', this.node) // 节点后置规则
      } else if (type === 3) {
        this.getDestinationData(this.node) // 节点选人规则
      }
    },
    // 打开审批人
    openApprover () {
      this.dialogApproverVisible = true
    },
    // 加载审批人列表
    getApproverList (data) {
      console.log(data)
      this.ApproverData = [...this.ApproverData,...data]
      if (data.length > 0) {
        data.forEach(item => {
          this.userIdList.push(item.ID)
        })
        console.log(this.userIdList)
      }
    },
    // 删除审批人
    deleteApprover (row, index) {
      console.log(row)
      console.log(this.userIdList)
      console.log(this.ApproverData)
      this.ApproverData.splice(index, 1)
      let i = this.userIdList.indexOf(row.ID)
      this.userIdList.splice(i, 1)
    },
    // 关闭添加审批人对话框
    closeDialog () {
      this.dialogApproverVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .config-info {
    padding: 0 10px 20px;
    h3 {
      margin-top: 5px;
    }
    .model-box {
      .bar {
        margin-bottom: 10px;
        ::v-deep .el-button--mini {
          padding: 5px 8px;
          vertical-align: top;
        }
      }
      h5 {
        &.h5 {
          font-size: 15px;
          font-weight: 600;
        }
        font-weight: 400;
        margin-top: 10px;
        margin-bottom: 8px;
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
      .box-card {
        ::v-deep .el-card__body {
          padding: 5px 15px 15px;
        }
      }
      .table {
        ::v-deep .el-table-column--selection .cell{
          padding-right: 10px;
        }
        ::v-deep .el-button--mini {
          padding: 5px 8px;
          vertical-align: top;
        }
        .cell-co {
          display: flex;
          .selectL {
            margin-right: 10px;
            width:120px
          }
          .selectR {
            width:130px
          }
          .input {
            width:180px
          }
        }
      }
      .footer {
        margin-top: 15px;
        .col {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
</style>
