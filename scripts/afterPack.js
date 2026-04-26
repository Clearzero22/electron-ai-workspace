/**
 * electron-builder 钩子：打包后处理
 * 用于删除不必要的文件、优化包大小
 */
exports.default = async function (context) {
  const { electronPlatformName, appOutDir } = context;

  console.log('=== 打包后处理开始 ===');
  console.log('平台:', electronPlatformName);
  console.log('输出目录:', appOutDir);

  // 可以在这里添加自定义处理逻辑
  // 例如：删除某些不需要的文件、修改配置等

  console.log('=== 打包后处理完成 ===');
};
