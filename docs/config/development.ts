export default [
  {
    title: 'Getting started',
    'title.zh-CN': '快速开始',
    type: 'group',
    children: [
      '/development',
      '/development/your-fisrt-plugin',
      '/development/app-ds',
      // '/development/plugin',
      // '/development/plugin-ds',
      // '/development/learning-guide',
    ],
  },
  {
    title: 'Server',
    'title.zh-CN': '服务端',
    type: 'group',
    children: [
      '/development/server',
      {
        title: 'Collections & Fields',
        'title.zh-CN': '数据表和字段',
        children: [
          '/development/server/collections',
          '/development/server/collections/options',
          '/development/server/collections/configure',
          '/development/server/collections/association-fields',
          '/development/server/collections/field-extension',
          '/development/server/collections/collection-template',
        ],
      },
      // {
      //   title: 'Resources & Actions',
      //   'title.zh-CN': '资源和操作',
      //   children: [
      //     '/development/server/resources-actions',
      //     '/development/server/resources-actions/configuration',
      //     // '/development/server/resources-actions/to-resource',
      //     '/development/server/resources-actions/vs-router',
      //   ],
      // },
      '/development/server/resources-actions',
      // '/development/server/routing',
      '/development/server/middleware',
      '/development/server/commands',
      '/development/server/events',
      '/development/server/i18n',
      '/development/server/logger',
      '/development/server/telemetry',
      '/development/server/migration',
      '/development/server/test',
    ],
  },
  {
    title: 'Client',
    'title.zh-CN': '客户端',
    type: 'group',
    children: [
      '/development/client',
      // '/development/client/life-cycle',
      '/development/client/router',
      '/development/client/styles-and-themes',
      '/development/client/api-client',
      '/development/client/providers',
      {
        title: 'UI Schema',
        'title.zh-CN': 'UI Schema',
        children: [
          '/development/client/ui-schema/quick-start',
          '/development/client/ui-schema/what-is-ui-schema',
          '/development/client/ui-schema/rendering',
          '/development/client/ui-schema/extending',
          '/development/client/ui-schema/components',
          '/development/client/ui-schema/designable',
          '/development/client/ui-schema/toolbar',
          '/development/client/ui-schema/initializer',
          '/development/client/ui-schema/settings',
        ],
      },
      '/development/client/i18n',
      '/development/client/test',
    ],
  },
  {
    title: 'Others',
    'title.zh-CN': '其他',
    type: 'group',
    children: [
      '/development/others/build',
      '/development/others/languages',
      '/development/others/deps',
      '/development/life-cycle',
    ],
  },
]