/**
 * 上传 service 调度层（统一入口）
 *
 * 根据 mode 路由到 OSS 直传 / 服务器中转通道，对外提供统一的 upload() 接口。
 * 业务侧无感知底层通道，切换 mode 即可换通道。
 *
 * 用法：
 *   const uploader = createUploader({
 *     mode: 'oss',
 *     region: 'oss-cn-hangzhou',
 *     bucket: 'your-bucket',
 *     stsApi: '/api/upload/sts',
 *     cdnDomain: 'https://cdn.example.com',
 *   })
 *   const { url } = await uploader.upload(file, {
 *     dir: 'device-photos',
 *     onProgress: (info) => console.log(info.percent + '%'),
 *   })
 *
 * Mock 模式（调试用，不连真实后端/OSS）：
 *   const uploader = createUploader({ mode: 'oss', useMock: true })
 */
import type { Uploader, UploadOptions, UploadResult, UploaderConfig } from './types'
import { OssUploader } from './oss-uploader'
import { ServerUploader } from './server-uploader'
import { mockSts, mockUpload } from './mock'

/**
 * 创建上传器。按 mode + useMock 选择具体通道实现。
 */
export function createUploader(config: UploaderConfig): Uploader {
  const { mode, useMock } = config

  if (mode === 'oss') {
    // OSS 直传：mock 模式提供假 STS；真实模式需后端 stsApi
    return new OssUploader(config, useMock ? mockSts : undefined)
  }

  // server 中转：mock 模式用模拟上传；真实模式需 serverApi
  return new ServerUploader(config, useMock ? mockUpload : undefined)
}

/** 便捷方法：快速发起一次上传，无需手动 createUploader（默认走配置） */
export async function uploadFile(
  config: UploaderConfig,
  file: File,
  options?: UploadOptions,
): Promise<UploadResult> {
  return createUploader(config).upload(file, options)
}

/**
 * 极简 OSS 直传：只需 STS 接口地址即可上传。
 *
 * region / bucket / cdnDomain 由后端 STS 接口随凭证返回，前端无需关心。
 * 适合绝大多数场景——后端掌握 bucket 信息，前端只负责拿凭证 + 传文件。
 *
 * @example
 *   const { url } = await uploadToOss(file, {
 *     stsApi: '/api/upload/sts',
 *     dir: 'device-photos',
 *     onProgress: (info) => console.log(info.percent + '%'),
 *   })
 */
export async function uploadToOss(
  file: File,
  opts: {
    /** 后端 STS 接口地址（颁发临时凭证 + bucket 信息） */
    stsApi: string
    /** 存储目录 */
    dir?: string
    /** 进度回调 */
    onProgress?: UploadOptions['onProgress']
    /** 取消信号 */
    signal?: AbortSignal
    /** 自定义文件名 */
    filename?: string
    /** 是否 mock（调试用） */
    useMock?: boolean
  },
): Promise<UploadResult> {
  return createUploader({ mode: 'oss', stsApi: opts.stsApi, useMock: opts.useMock }).upload(file, {
    dir: opts.dir,
    filename: opts.filename,
    onProgress: opts.onProgress,
    signal: opts.signal,
  })
}

/**
 * 极简服务器中转上传：只需服务器接口地址即可上传。
 *
 * @example
 *   const { url } = await uploadToServer(file, {
 *     serverApi: '/api/upload/file',
 *     onProgress: (info) => console.log(info.percent + '%'),
 *   })
 */
export async function uploadToServer(
  file: File,
  opts: {
    /** 服务器上传接口地址 */
    serverApi: string
    /** 额外请求头（如鉴权 token） */
    headers?: Record<string, string>
    /** 存储目录 */
    dir?: string
    /** 进度回调 */
    onProgress?: UploadOptions['onProgress']
    /** 取消信号 */
    signal?: AbortSignal
    /** 自定义文件名 */
    filename?: string
    /** 是否 mock（调试用） */
    useMock?: boolean
  },
): Promise<UploadResult> {
  return createUploader({
    mode: 'server',
    serverApi: opts.serverApi,
    headers: opts.headers,
    useMock: opts.useMock,
  }).upload(file, {
    dir: opts.dir,
    filename: opts.filename,
    onProgress: opts.onProgress,
    signal: opts.signal,
  })
}

// 类型导出（便于业务侧 import { UploadResult } from '@/services/upload'）
export type {
  UploadMode,
  StsCredentials,
  ProgressInfo,
  UploadOptions,
  UploadResult,
  Uploader,
  UploaderConfig,
} from './types'
export { clearStsCache } from './sts'
