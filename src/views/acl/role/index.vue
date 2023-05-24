<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索:">
        <el-input
          placeholder="请输入搜索职位关键字"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addRole">添加职位</el-button>
    <el-table border :data="allRole">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="selectPower(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定删除${row.roleName}吗?`"
            width="260px"
            @confirm="deleteRole(row)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 @current-change="getHasUser"-->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>

  <!-- 新增职位与更新的弹框 -->
  <el-dialog
    v-model="dialogVisite"
    :title="rolePramas.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="rolePramas" :rules="rules" ref="roleRef">
      <el-form-item label="职位名称:" prop="roleName">
        <el-input
          placeholder="请输入添加的职位名称"
          v-model="rolePramas.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </template>
  </el-dialog>
  <!-- 分配权限的抽屉 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h2>分配权限</h2>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        show-checkbox
        node-key="id"
        :data="menuArr"
        :default-checked-keys="IdArr"
        :props="defaultProps"
        default-expand-all
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="handler">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/module/setting.ts'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role/index'
import type { RoleResponseDdata, Records } from '@/api/acl/role/type'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
let drawer1 = ref<boolean>(false)
//当前页
let currentPage = ref<number>(1)
//一页的数据个数
let pageSize = ref<number>(5)
let total = ref<number>(0)
// let roleName = ref<string>('')
let allRole = ref<Records>([])
//搜索输入框关键字
let keyword = ref<string>('')
// 控制弹框的显示
let dialogVisite = ref<boolean>(false)
// 用来收集职位数据
let rolePramas = reactive<RoleData>({
  roleName: '',
})
//拿到树形dom
let tree = ref()
// 拿到form表单
let roleRef = ref<any>()
const validatorRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少两位'))
  }
}
// 添加职位表单的规则
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}
onMounted(() => {
  getHasRole()
})

// 获取当前表单数据
const getHasRole = async (pager = 1) => {
  currentPage.value = pager
  let result: RoleResponseDdata = await reqAllRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
// 当前页数变化
const currentChange = () => {
  getHasRole(currentPage.value)
}
// 一页可展示的数据个数发生变化
const sizeChange = () => {
  getHasRole()
}
// 搜索
const search = () => {
  getHasRole()
  keyword.value = ''
}
// 重置 即刷新
const reset = () => {
  let useSettingStore = useLayoutSettingStore()
  useSettingStore.refresh = !useSettingStore.refresh
}

// 添加职位
const addRole = () => {
  dialogVisite.value = true
  rolePramas.roleName = ''
  rolePramas.id = undefined
  // 清空上一次检验结果
  nextTick(() => {
    roleRef.value.clearValidate('roleName')
  })
}
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  Object.assign(rolePramas, row)
  // 清空上一次检验结果
  nextTick(() => {
    roleRef.value.clearValidate('roleName')
  })
}

// 保存按钮回调
const save = async () => {
  // 先检验表单验证是否通过
  await roleRef.value.validate()
  // 添加|gengxin
  let result: any = await reqAddOrUpdateRole(rolePramas)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: rolePramas.id ? '更新成功!' : '添加成功!',
    })
    dialogVisite.value = false
    getHasRole(rolePramas.id ? currentPage.value : 1)
  }
}
// 存储用户权限的数据
let menuArr = ref<MenuList>([])
let IdArr = ref<number[]>([])
// 分配权限的回调
const selectPower = async (row: RoleData) => {
  drawer1.value = true
  // 收集当前要分配权限的职位的数据
  Object.assign(rolePramas, row)
  IdArr.value = []
  let result: MenuResponseData = await reqAllMenuList(rolePramas.id as number)
  if (result.code === 200) {
    menuArr.value = result.data
    IdArr.value = filterSelectArr(menuArr.value, [])
  }
}
// 这个方法用来过滤出这个树形结构里面最底层里面勾选的ID(因为树形的特点，只需找出最底层已经的勾选上的就行了)
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 点击确认分配的回调
const handler = async () => {
  let roleId = rolePramas.id
  // 选中结点的ID
  let arr = tree.value.getCheckedKeys()
  // 半选中的结点ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //下发权限
  let result = await reqSetPermission(roleId as number, permissionId)
  if (result.code === 200) {
    drawer1.value = false
    // getHasRole(currentPage.value)
    //应该重新刷新一下整个页面 因为权限改了 按钮权限等等会发生变化
    ElMessage({ type: 'success', message: '分配权限成功!' })
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
}
// 删除角色
const deleteRole = async (row: RoleData) => {
  let result = await reqRemoveRole(row.id as number)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功!' })
    getHasRole(
      allRole.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  }
}
</script>
<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
