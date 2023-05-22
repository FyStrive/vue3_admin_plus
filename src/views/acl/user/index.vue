<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-popconfirm title="确定删除这些吗?" width="260px" @confirm="deleteUserList">
      <template #reference>
        <el-button type="primary" :disabled="deleteIdList.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>

    <el-table border :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">
            分配角色
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
            编辑
          </el-button>
          <el-popconfirm :title="`你确定删除${row.username}吗?`" width="260px" @confirm="deleteUser(row)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @current-change="getHasUser"
      @size-change="handler" />
  </el-card>

  <!-- 添加用户|编辑用户的抽屉 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userPrama.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <div>
        <el-form :model="userPrama" :rules="rules" ref="modelUser">
          <el-form-item label="用户姓名:" prop="name">
            <el-input placeholder="请输入用户姓名" v-model="userPrama.name"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop="username">
            <el-input placeholder="请输入用户昵称" v-model="userPrama.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码:" prop="password" v-if="!userPrama.id">
            <el-input placeholder="请输入用户密码" v-model="userPrama.password" type="password" show-password></el-input>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 分配角色的抽屉 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <div>
        <el-form :model="userPrama" :rules="rules" ref="modelUser">
          <el-form-item label="用户姓名:">
            <el-input placeholder="请输入用户姓名" v-model="userPrama.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handlerAllCheck">全选
            </el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedRoleChange">
              <el-checkbox v-for="role in allRole" :key="role.id" :label="role">{{
                role.roleName
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/module/setting.ts'
import { reqAllUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqDeleteUser, reqDeleteAllUser } from '@/api/acl/user/index.ts'
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type.ts'
import { validatePwd } from '@/utils/util.ts'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
let keyword = ref('')//搜索关键词
// 拿到form表单
let modelUser = ref()
// 当前的页数
let currentPage = ref<number>(1)
// 每页数据个数
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)
//控制抽屉显示隐藏
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
// 村粗用户的数组
let userArr = ref<Records>([])
// 收集用户数据
let userPrama = reactive<User>({
  username: '',
  name: '',
  password: '',
  id: undefined,
})
//搜索事件
const search = () => {
  getHasUser()
  // 搜索结束置空输入框
  keyword.value = ''
}
let useSettingStore = useLayoutSettingStore()
//重置按钮
const reset = () => {
  useSettingStore.refresh = !useSettingStore.refresh
}
// 用于记录被批量删除的用户
let deleteIdList = ref<User[]>([])

const deleteUserList = async () => {
  let list: any = deleteIdList.value.map(item => { return item.id })
  // console.log(deleteIdList.value.map(item => {return item}));
  let result = await reqDeleteAllUser(list)
  if (result.code === 200) {
    getHasUser(userArr.value.length > 1 ? currentPage.value : currentPage.value - 1)
    ElMessage({ type: 'success', message: '批量删除成功!' })
  } else {
    ElMessage({ type: 'error', message: '批量删除失败!' })
  }
}
onMounted(() => {
  getHasUser()
})
const selectChange = (values: any) => {
  // console.log(value['id']);
  deleteIdList.value = values
  console.log(deleteIdList);
}
// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  currentPage.value = pager
  let result: UserResponseData = await reqAllUserInfo(
    currentPage.value,
    pageSize.value,
    keyword.value
  )
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 处理每页个数变化的函数
const handler = () => {
  getHasUser()
}
// 添加用户的函数
const addUser = () => {
  console.log(userPrama, 0);
  Object.assign(userPrama, {
    username: '',
    name: '',
    password: '',
    id: ''
  })
  userPrama.password = ''
  console.log(userPrama, 1);
  drawer.value = true
  // 情空收集表格数据
  // 清楚上一次的表单检验结果
  nextTick(() => {
    modelUser.value.clearValidate('username')
    modelUser.value.clearValidate('name')
    modelUser.value.clearValidate('password')
  })
}
// row为用户的信息
const updateUser = (row: User) => {
  Object.assign(userPrama, row)
  drawer.value = true
  nextTick(() => {
    modelUser.value.clearValidate('username')
    modelUser.value.clearValidate('name')
  })
}
const deleteUser = async (row: User) => {
  let userId: number = row.id as number
  let result = await reqDeleteUser(userId)
  if (result.code === 200) {
    getHasUser(userArr.value.length > 1 ? currentPage.value : currentPage.value - 1)
    ElMessage({ type: 'success', message: `删除用户${row.username}成功!` })
  } else {
    ElMessage({ type: 'error', message: `删除用户${row.username}失败!` })
  }
}
// 保存的回调
const save = async () => {
  await modelUser.value.validate()
  let result: any = await reqAddOrUpdateUser(userPrama)
  if (result.code === 200) {
    drawer.value = false //关闭抽屉
    ElMessage({
      type: 'success',
      message: userPrama.id ? '更新成功!' : '添加成功!',
    })
    // 获取最新表格数据  如果更新就留在当前页
    getHasUser(userPrama.id ? currentPage.value : 1)
    // 保存成功后重新刷新一下浏览器
    userPrama.id && window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userPrama.id ? '更新失败!' : '添加失败!',
    })
  }
}
const cancel = () => {
  drawer.value = false
}
// 对姓名检验
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户姓名长度至少五位'))
  }
}
// 对昵称校验
const validatorUserName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称长度至少五位'))
  }
}
// 对密码进行校验
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (validatePwd(value.trim())) {
    callback()
  } else {
    callback(new Error('密码包含大写字母、小写字母、数字、特殊字符中的三种，长度8-16位'))
  }
}
const rules = {
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 全选框
let checkAll = ref<boolean>(false)
// 设置不确定状态
let isIndeterminate = ref<boolean>(true)
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
const setRole = async (row: User) => {
  Object.assign(userPrama, row)
  let result: AllRoleResponseData = await reqAllRole(row.id as number)
  if (result.code === 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true

  }
}
// 底部复选框的操作
const handleCheckedRoleChange = () => {
  // 已经勾选的框的长度
  const checkCount = userRole.value.length
  checkAll.value = checkCount === allRole.value.length
  isIndeterminate.value = (checkCount > 0) && checkCount < allRole.value.length
}
const handlerAllCheck = () => {
  userRole.value = checkAll.value ? allRole.value : []
  isIndeterminate.value = false
}

const saveRole = async () => {
  let data: SetRoleData = {
    userId: (userPrama.id as number),
    roleIdList: userRole.value.map(item => { return (item.id as number) })
  }
  console.log(data);
  let result = await reqSetUserRole(data)
  console.log(result, 'resu');
  if (result.code === 200) {
    drawer1.value = false
    ElMessage({ type: 'success', message: '分配职位成功!' })
    getHasUser(currentPage.value)
  } else {
    drawer1.value = false
    ElMessage({ type: 'error', message: '分配职位失败!' })
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
