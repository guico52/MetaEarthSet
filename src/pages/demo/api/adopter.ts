import { Building, Floor } from "@mars/pages/demo/module/model/Building"
import { mapStore, stateStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { Cesium } from "mars3d"
import { Space } from "ant-design-vue"


const floorHeight = 5
const spaceHeight = 3
const fenceHeight = 5
const openAirHeight = 5


export interface Location {
  x: number
  y: number
  z: number
}

export class ModelData {
  parentCode: string
  code: string
  name: string
  // multiple positions for polygon(0~4type), single position for point(5~8type)
  path: number[][]
  /**
   * 0: building
   * 1: floor
   * 2: space
   * 3: fence
   * 4: openAir
   * 5: graphicDraw
   * 6: human
   * 7: camera
   * 8: selfDefinedModel
   */
  type: number
  districtType: number

  floorNumber: number | null

  // for camera, data is flvUrl
  // for selfDefinedModel, data is url of model
  data: string

  constructor(parentCode: string, code: string, name: string, path: number[][], type: number, floorNumber?: number, data?: string) {
    this.parentCode = parentCode
    this.code = code
    this.name = name
    this.path = path
    this.type = type
    this.districtType = type
    this.floorNumber = floorNumber
    this.data = data
  }

  toGraphicInterface(parentId: string): GraphicInterface {
    let returnObj: GraphicInterface
    switch (this.type) {
      case 0 : {
        const returnObj = new Building(mapStore.state.graphicLayer, this.pathToCartesian3() as Cesium.Cartesian3[], this.name, null, null, null,
          true, this.code)
        mapStore.state.buildingMap.set(this.code, returnObj)
        break
      }
      case 1: {
        const building = mapStore.state.buildingMap.get(parentId)
        const returnObj = new Floor(this.pathToCartesian3() as Cesium.Cartesian3[], building, this.name, this.floorNumber, null, this.code)
        mapStore.state.floorBuildingMap.set(this.code, this.parentCode)
        break
      }
      case 2: {
        const floor = mapStore.getters.getFloorByFloorId(this.code)
        const returnObj = new Space(this.pathToCartesian3() as Cesium.Cartesian3[], floor, this.name, null, this.code)
        mapStore.state.spaceFloorMap.set(this.code, this.parentCode)
        break
      }
    }
    stateStore.commit("updateLeftBarNeedUpdate", true)
    return returnObj
  }

  pathToCartesian3(): Cesium.Cartesian3[] | Cesium.Cartesian3 {
    if (this.path.length === 1) {
      return new Cesium.Cartesian3(this.path[0][0], this.path[0][1], this.path[0][2])
    } else {
      return this.path.map((item) => {
        return new Cesium.Cartesian3(item[0], item[1], item[2])
      })
    }
  }
}
