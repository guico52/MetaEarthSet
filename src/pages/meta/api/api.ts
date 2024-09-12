// axios配置
import { ModelData } from "@mars/pages/meta/api/adopter"
import { ref } from "vue"
import axios from "axios"

export const instance = axios.create({
  // baseURL: "https://api.test01.platform.ahjtest.top",// 测试环境
  baseURL: "https://api.dev3.platform.ahjdev.top", // dev 环境
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: "Bearer ea8c0470-7f2f-473d-b3c0-be2add35a42c" // 测试环境
    Authorization: "Bearer 1ad0e9c9-f62d-420b-a325-0490a775abd1" // dev环境
  }
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function post(url: string, data: any) {
  return instance.post(url, data)
}

export function get(url: string) {
  return instance.get(url)
}

export function deleteReq(url: string) {
  return instance.delete(url)
}

export function addModel(modelData) {
  return instance.post("/xay/v1/sys/district/save", modelData)
}

export function updateModel(modelData) {
  return instance.post("/xay/v1/sys/district/update", modelData)
}

const deleteData = ref({
  id: ""
})
export function deleteModel(id) {
  deleteData.value.id = id
  return instance.delete("/xay/v1/sys/district/del", { data: deleteData.value })
}

export function getModel(param) {
  return instance.get("/xay/v1/sys/district/find-tree", param)
}

export function getThree() {
  return instance.get("/xay/v1/sys/district/find-second-level-tree")
}

export function getDetail(secondLevelDistrictId, currentDistrictId) {
  // alert("/xay/v1/sys/district/find-tree-info/" + secondLevelDistrictId + "/" + currentDistrictId)
  return instance.get("/xay/v1/sys/district/find-tree-info/" + secondLevelDistrictId + "/" + currentDistrictId)
}

export function getHumen() {
  return instance.get("/v1/iot/device/queryUserGps")
}


export function getCamera(param) {
  return instance.post("/v1/iot/device/selectMonitorDevicePage", param)
}
