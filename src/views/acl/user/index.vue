<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button type="primary">批量删除</el-button>
    <el-table border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User">
            分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-button type="primary" size="small" icon="Delete">删除</el-button>
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
      <h4>添加用户</h4>
    </template>
    <template #default>
      <div>
        <el-form :model="userPrama" :rules="rules">
          <el-form-item label="用户姓名:" prop="name">
            <el-input placeholder="请输入用户姓名" v-model="userPrama.name"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop="username">
            <el-input placeholder="请输入用户昵称" v-model="userPrama.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码:" prop="password">
            <el-input placeholder="请输入用户密码" v-model="userPrama.password"></el-input>
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
</template>

<script setup lang="ts">
import { reqAllUserInfo, reqAddOrUpdateUser } from '@/api/acl/user/index.ts'
import type { UserResponseData, Records, User } from '@/api/acl/user/type.ts'
import { ElMessage } from 'element-plus';
import { ref, onMounted, reactive } from 'vue'
// 当前的页数
let currentPage = ref<number>(1)
// 每页数据个数
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)
//控制抽屉显示隐藏
let drawer = ref<boolean>(false)
// 村粗用户的数组
let userArr = ref<Records>([])
// 收集用户数据
let userPrama = reactive<User>({
  username: '',
  name: '',
  password: '',
  id: undefined
})
onMounted(() => {
  getHasUser()
})
// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  currentPage.value = pager
  let result: UserResponseData = await reqAllUserInfo(currentPage.value, pageSize.value)
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
  drawer.value = true
  // 情空收集表格数据
  Object.assign(userPrama, {
    username: '',
    name: '',
    password: '',
    id: undefined
  })
}
// row为用户的信息
const updateUser = (row: User) => {
  userPrama.username = row.username
  userPrama.name = row.name
  userPrama.id = row.id
  drawer.value = true
}
// 保存的回调
const save = async () => {
  let result: any = await reqAddOrUpdateUser(userPrama)
  console.log(result);
  if (result.code === 200) {
    drawer.value = false//关闭抽屉
    ElMessage({ type: 'success', message: userPrama.id ? '更新成功!' : '添加成功!' })
    // 获取最新表格数据
    getHasUser()
  } else {
    drawer.value = false
    ElMessage({ type: 'error', message: userPrama.id ? '更新失败!' : '添加失败!' })
  }
}
const cancel = () => {
  drawer.value = false
}
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户姓名长度至少五位'))
  }

}
const validatorUserName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称长度至少五位'))
  }

}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码长度至少六位'))
  }

}
const rules = {
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}
</script>
<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
