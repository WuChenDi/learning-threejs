<!-- eslint-disable no-console -->
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

let mixer: THREE.AnimationMixer
const clock = new THREE.Clock()
const containerRef = ref<HTMLElement | null>(null)
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, stats: Stats

onMounted(() => {
  // 确保DOM元素已经挂载
  nextTick(() => {
    if (containerRef.value) {
      init()
      animate()
    }
    else {
      console.error('Container element not found')
    }
  })
})

function init() {
  // 使用ref获取的DOM元素
  const container = containerRef.value
  if (!container) {
    console.error('Container element is null')
    return
  }

  // 获取容器的宽高而不是窗口的宽高
  const width = container.clientWidth
  const height = container.clientHeight

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 100)
  camera.position.set(2, 3, -6)

  scene = new THREE.Scene()

  // 环境光
  const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x8D8D8D, 3)
  hemiLight.position.set(0, 20, 0)
  scene.add(hemiLight)

  // 方向光
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
  dirLight.position.set(-3, 10, -10)
  dirLight.castShadow = true
  dirLight.shadow.camera.top = 4
  dirLight.shadow.camera.bottom = -4
  dirLight.shadow.camera.left = -4
  dirLight.shadow.camera.right = 4
  dirLight.shadow.camera.near = 0.1
  dirLight.shadow.camera.far = 40
  scene.add(dirLight)

  // 地面
  const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
  )
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.receiveShadow = true
  scene.add(groundMesh)

  // 创建一个临时几何体，确保在模型加载前有内容显示
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x00FF00 })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.5, 0)
  scene.add(cube)

  // 加载 GLTF 模型
  const loader = new GLTFLoader()
  // 添加错误处理
  loader.load(
    '/models/gltf/RobotExpressive/RobotExpressive.glb',
    (gltf) => {
      const model = gltf.scene
      model.position.set(0, 0, 0)
      model.scale.set(1, 1, 1)
      model.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          object.castShadow = true
        }
      })
      scene.add(model)
      // 移除临时几何体
      scene.remove(cube)

      // 创建动画混合器
      mixer = new THREE.AnimationMixer(model)
      const clips = gltf.animations

      // 播放第一个动画
      if (clips?.[0]) {
        const action = mixer.clipAction(clips[0])
        action.play()
      }
    },
    // 添加进度回调
    (xhr) => {
      console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
    },
    // 添加错误回调
    (error) => {
      console.error('An error happened during model loading:', error)
    },
  )

  // 加载 HDR 环境贴图
  new RGBELoader()
    .load(
      '/textures/equirectangular/venice_sunset_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
      },
      undefined,
      (error) => {
        console.error('An error happened during texture loading:', error)
        // 如果HDR加载失败，设置一个默认背景色
        scene.background = new THREE.Color(0x333333)
      },
    )

  // 渲染器设置
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  // 清空容器并添加渲染器
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  container.appendChild(renderer.domElement)

  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableZoom = true
  controls.target.set(0, 1, 0)
  controls.update()

  // 性能监控
  stats = new Stats()
  container.appendChild(stats.dom)

  // 窗口大小调整
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  if (!containerRef.value || !renderer) {
    return
  }

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()
  if (mixer) {
    mixer.update(delta)
  }

  if (stats) {
    stats.update()
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}
</script>

<template>
  <div class="page">
    <ClientOnly>
      <div id="container" ref="containerRef" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#container {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}
</style>
