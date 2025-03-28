import { ClientOnly } from '#components'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'webglAnimationKeyframes',
  setup() {
    const logger = useLogger()

    const containerRef = ref<HTMLDivElement | null>(null)
    const clock = new THREE.Clock()

    let mixer: THREE.AnimationMixer,
      camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      renderer: THREE.WebGLRenderer,
      controls: OrbitControls,
      stats: Stats

    const onWindowResize = () => {
      if (!containerRef.value || !camera || !renderer) {
        return
      }

      const width = containerRef.value.clientWidth
      const height = containerRef.value.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const animate = () => {
      const delta = clock.getDelta() // 使用同一个时钟实例

      if (mixer) {
        mixer.update(delta)
      }

      controls.update()
      stats.update()
      renderer.render(scene, camera)
    }

    const initScene = () => {
      const container = containerRef.value
      if (!container) {
        logger.error('Container element is null')
        return
      }

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(container.clientWidth, container.clientHeight)

      // 清空容器并添加渲染器
      container.innerHTML = ''
      container.appendChild(renderer.domElement)

      // Scene setup
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xBFE3DD)

      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture

      // Camera setup
      camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        1,
        100,
      )
      camera.position.set(5, 2, 8)

      // Controls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 0.5, 0)
      controls.update()
      controls.enablePan = false
      controls.enableDamping = true

      // Stats
      stats = new Stats()
      container.appendChild(stats.dom)

      // Model and animation loader
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('jsm/libs/draco/gltf/')

      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)
      loader.load(
        'models/gltf/LittlestTokyo.glb',
        (gltf) => {
          const model = gltf.scene
          model.position.set(1, 1, 0)
          model.scale.set(0.01, 0.01, 0.01)
          scene.add(model)

          mixer = new THREE.AnimationMixer(model)
          if (gltf.animations?.[0]) {
            mixer.clipAction(gltf.animations[0]).play()
          }

          // 使用Three.js内置的动画循环
          renderer.setAnimationLoop(animate)
        },
        undefined,
        (error) => {
          logger.error('Error loading model:', error)
        },
      )

      window.addEventListener('resize', onWindowResize)
    }

    onMounted(() => {
      nextTick(() => {
        if (containerRef.value) {
          initScene()
        }
        else {
          logger.error('Container element not found')
        }
      })
    })

    onBeforeUnmount(() => {
      // 清理动画循环
      if (renderer) {
        renderer.setAnimationLoop(null)
      }

      window.removeEventListener('resize', onWindowResize)

      if (containerRef.value) {
        containerRef.value.innerHTML = ''
      }
    })

    return {
      containerRef,
    }
  },

  render() {
    return (
      <div class="w-full h-screen m-0 p-0 overflow-hidden">
        <ClientOnly>
          <div id="container" ref="containerRef" class="w-full h-full bg-[#f0f0f0]" />
        </ClientOnly>
      </div>
    )
  },
})
