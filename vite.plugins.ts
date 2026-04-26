import JavaScriptObfuscator from 'javascript-obfuscator';
import type { Plugin } from 'vite';

/**
 * Vite插件：JavaScript代码混淆
 */
export function obfuscatorPlugin(): Plugin {
  return {
    name: 'vite-plugin-javascript-obfuscator',
    apply: 'build',
    generateBundle(_options, bundle) {
      // 只在生产环境混淆
      if (process.env.NODE_ENV !== 'production') return;

      Object.keys(bundle).forEach((key) => {
        const file = bundle[key] as any;

        // 只混淆JS文件
        if (file.type === 'chunk' || file.fileName.endsWith('.js')) {
          const obfuscationResult = JavaScriptObfuscator.obfuscate(file.code, {
            // 基础配置
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.5,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.3,
            debugProtection: false, // 设为true会禁止调试，但可能影响性能
            debugProtectionInterval: 0,
            disableConsoleOutput: true, // 禁用console输出
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true, // 自我保护
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 5,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false,

            // Source Map（生产环境不生成）
            sourceMap: false,
            sourceMapMode: 'separate'
          });

          file.code = obfuscationResult.getObfuscatedCode();
        }
      });
    }
  };
}

/**
 * Terser插件：代码压缩和优化
 */
export function terserPlugin(): Plugin {
  return {
    name: 'vite-plugin-terser',
    apply: 'build',
    config() {
      return {
        build: {
          minify: 'terser',
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug'],
            },
            format: {
              comments: false,
            },
          },
        },
      };
    },
  };
}
