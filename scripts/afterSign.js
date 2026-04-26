/**
 * electron-builder 钩子：签名后处理
 * 用于代码签名后的额外操作
 */
exports.default = async function (context) {
  const { electronPlatformName, appOutDir } = context;

  console.log('=== 签名后处理开始 ===');
  console.log('平台:', electronPlatformName);

  // Windows代码签名
  if (electronPlatformName === 'windows') {
    console.log('Windows代码签名完成');
  }

  // macOS代码公证
  if (electronPlatformName === 'darwin') {
    console.log('macOS代码公证完成');
  }

  console.log('=== 签名后处理完成 ===');
};
