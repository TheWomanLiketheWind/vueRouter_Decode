let _Vue = null

export default class VueRouter {
  constructor(options) {
    // 记录构造函数中传入当对象，{ routes: 路由规则, }
    this.options = options
    // 路由地址和组件当关系，将路由规则解析到routeMap里面 ----{ 路由名：路由组件 }
    this.routeMap = {}
    // data: { current: 当前路由地址 } ， data为响应式对象
    // mode 在默认情况下是hash模式，只有当设置为history模式时，才会进入历史模式
    this.data = _Vue.observable({
      current: options.mode === 'history' ? window.location.pathname : window.location.hash.slice(1)
    })
  }
  // 实现Vue的插件机制
  static install(Vue) {
    // 1. 判断当前插件是否被安装
    if (VueRouter.install.installed) return

    VueRouter.install.installed = true
    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue

    // 3. 把创建Vue实例时候传入到router对象注入到Vue实例上
    // 混入
    _Vue.mixin({
      beforeCreate() {
        // 请注意---此时的this，表示的是Vue实例，因为在此处无法访问到的this是Vue, 所以此处我们使用this.$options.router来代替VueRouter的this
        // 在获取Vue实例的时候，注入 （ 组件不会掉用 ）
        if (this.$options.router) {
          // 将构造函数中注册的options, routeMap, data , 挂载到 Vue的原型上
          _Vue.prototype.$router = this.$options.router
          // 
          this.$options.router.init()
        }
      }
    })
  }
  /**多个方法的集合 */
  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  /** 初始化RouteMap属性 */
  createRouteMap() {
    // 遍历所有到路由规则，把路由规则解析成键值对到形式，存储到routerMap中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  /** 
   * 注册组件 router-link and router-view 组件
   * 
   * Vue.component(id, [definition])
   * @id 自定义组件名
   * @definition 扩展过的构造器 / 选项对象 Vue.extend({  })
   * 注册或获取全局组件。注册还会自动使用给定的 id 设置组件的名称
   * */
  initComponents(Vue) {
    // 创建router-link组件
    Vue.component('router-link', {
      // router-link 标签上存在的参数，并获取跳转路径
      props: {
        to: String,
      },
      render(h) {
        // 将router-link 组件转化成 a 标签，href 为跳转路径，并为a标签添加点击事件，
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        },
          // 类似插槽，将route-link 标签的子元素，插入
          [this.$slots.default])
      },
      methods: {
        clickHandler(e) {
          // history.pushState(状态对象, 页面标题, 跳转URL)
          if (this.$router.options.mode === 'history') {
            history.pushState({}, '', this.to)
          } else {
            window.location.hash = this.to
          }
          this.$router.data.current = this.to
          // 路由跳转
          // 阻止浏览器请求服务器
          e.preventDefault()
        }
      }
    })

    // 创建router-view组件
    const self = this
    Vue.component('router-view', {
      render(h) {
        // 根据当前路径跳转路径对应的组件
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  /**注册popstate方法 / 监听-浏览器历史的变化，改变Router-view 组件跳转 */
  initEvent() {
    /**  
     * history 模式
     * target.addEventListener(type, listener, options); 
     * 
     * @target 事件目标可以是一个文档上的元素 Element,Document和Window或者任何其他支持事件的对象
     * @type 表示监听事件类型的字符串
     * @listener 当所监听的事件类型触发时，会接收到一个事件通知对象。listener 必须是一个实现了 EventListener 接口的对象，或者是一个函数。
     * @options 一个指定有关 listener 属性的可选参数对象。可用的选项如下：
     *          1. capture: Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发
     *          2. once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
     *          3. passive: Boolean，设置为true时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
     *          4. mozSystemGroup: 只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。
    */

    if (this.options.mode === 'history') {
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    } else {
      window.addEventListener('hashchange', () => {
        this.data.current = window.location.hash.slice(1)
      }, false)
    }
  }
}