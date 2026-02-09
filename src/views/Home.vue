<template>
  <div class="w-full h-full overflow-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 scrollbar-w-none">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <!-- 主标题区域 -->
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
          Sim Trade
        </h1>
        <p class="text-xl text-gray-600 mb-2">外贸实习平台自动化工具</p>
        <p class="text-sm text-gray-500">让外贸实习操作更高效、更智能</p>
      </div>

      <!-- Sim Trade 平台介绍 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <Icon icon="mdi:earth" class="text-5xl text-blue-600" />
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">关于 Sim Trade</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              SimTrade 是由<strong>对外经济贸易大学</strong>与<strong>南京世格软件有限责任公司</strong>联合开发的外贸实习平台，
              旨在为各级院校的外贸相关学科提供一个近乎真实的国际贸易虚拟环境。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              该平台融合了国际经济学、电子商务理论和外贸实务流程，采用基于互联网的三层体系架构。
              学生在平台中扮演进出口业务流程中的不同角色，通过角色扮演，熟练掌握业务技巧，
              理解国际贸易的物流、资金流和业务流的运作方式。
            </p>
            <a 
              href="https://www.desunsoft.net/simtradeykdx/login.aspx" 
              target="_blank"
              class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Icon icon="mdi:open-in-new" class="text-lg" />
              访问 Sim Trade 平台
            </a>
          </div>
        </div>
      </div>

      <!-- 软件功能说明 -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">软件功能</h2>
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <p class="text-lg text-gray-700 leading-relaxed mb-6 text-center">
            本软件是一款专为 SimTrade 外贸实习平台设计的<strong class="text-blue-600">自动化工具</strong>，
            能够简化和自动化平台上的各项操作流程，大幅提升学习和操作效率。
          </p>
        </div>
      </div>

      <!-- 核心功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- 自动创建合同 -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-blue-100 rounded-lg p-3">
              <Icon icon="mdi:file-document-edit" class="text-3xl text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">自动创建合同</h3>
          </div>
          <p class="text-gray-600 leading-relaxed">
            根据用户设定的参数，自动生成符合要求的外贸合同，减少手动输入的时间和错误。
          </p>
        </div>

        <!-- 角色模拟 -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-green-100 rounded-lg p-3">
              <Icon icon="mdi:account-group" class="text-3xl text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">多角色模拟</h3>
          </div>
          <p class="text-gray-600 leading-relaxed">
            自动模拟出口商、进口商、供应商、进口地银行和出口地银行的操作流程。
          </p>
        </div>

        <!-- 自动化执行 -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-purple-100 rounded-lg p-3">
              <Icon icon="mdi:robot" class="text-3xl text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">全流程自动化</h3>
          </div>
          <p class="text-gray-600 leading-relaxed">
            实现从询盘、报盘、还盘、成交，到合同签订、信用证开立、货物运输、报关报检、结汇等全流程的自动化执行。
          </p>
        </div>
      </div>

      <!-- 角色展示 -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">支持的角色</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <Icon icon="mdi:account-tie" class="text-4xl text-blue-600 mb-2 mx-auto" />
            <p class="text-sm font-medium text-gray-700">出口商</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <Icon icon="mdi:account-tie-outline" class="text-4xl text-green-600 mb-2 mx-auto" />
            <p class="text-sm font-medium text-gray-700">进口商</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <Icon icon="mdi:factory" class="text-4xl text-orange-600 mb-2 mx-auto" />
            <p class="text-sm font-medium text-gray-700">供应商</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <Icon icon="mdi:bank" class="text-4xl text-purple-600 mb-2 mx-auto" />
            <p class="text-sm font-medium text-gray-700">出口地银行</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <Icon icon="mdi:bank-outline" class="text-4xl text-indigo-600 mb-2 mx-auto" />
            <p class="text-sm font-medium text-gray-700">进口地银行</p>
          </div>
        </div>
      </div>

      <!-- 优势特点 -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 class="text-3xl font-bold text-center mb-8">为什么选择我们</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <Icon icon="mdi:lightning-bolt" class="text-5xl mb-4 mx-auto" />
            <h3 class="text-xl font-semibold mb-2">高效便捷</h3>
            <p class="text-blue-100">自动化执行，大幅节省操作时间</p>
          </div>
          <div class="text-center">
            <Icon icon="mdi:shield-check" class="text-5xl mb-4 mx-auto" />
            <h3 class="text-xl font-semibold mb-2">准确可靠</h3>
            <p class="text-blue-100">减少人为错误，提高操作准确性</p>
          </div>
          <div class="text-center">
            <Icon icon="mdi:school" class="text-5xl mb-4 mx-auto" />
            <h3 class="text-xl font-semibold mb-2">学习辅助</h3>
            <p class="text-blue-100">帮助理解外贸流程，提升实习效果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>