/**
 * 上传 service 类型定义
 *
 * 两套上传通道（OSS 直传 / 服务器中转）对外统一类型，
 * 业务侧无需关心底层走哪个通道。
 */

/** 上传通道 */
export type UploadMode = 'oss' | 'server'

/** STS 临时凭证（阿里云 STS 颁发，后端返回） */
export interface StsCredentials {
  /** 临时 AccessKeyId */
  AccessKeyId: string
  /** 临时 AccessKeySecret */
  AccessKeySecret: string
  /** 安全令牌 */
  SecurityToken: string
  /** 过期时间（ISO 字符串或时间戳），前端据此提前刷新 */
  Expiration: string | number
  /** 允许上传的目录前缀（后端通过 RAM 策略限定，如 'device-photos/'） */
  dir?: string
  /**
   * OSS region（推荐由后端随凭证一并返回，前端无需单独配置）
   * 如 'oss-cn-hangzhou'
   */
  region?: string
  /**
   * Bucket 名称（推荐由后端随凭证一并返回，前端无需单独配置）
   */
  bucket?: string
  /**
   * 访问域名前缀（拼接最终 URL，如 'https://cdn.example.com'）
   * 推荐由后端随凭证返回，前端无需单独配置
   */
  cdnDomain?: string
}

/** 上传进度回调参数 */
export interface ProgressInfo {
  /** 已上传字节 */
  loaded: number
  /** 总字节 */
  total: number
  /** 进度百分比 0~100 */
  percent: number
}

/** 单次上传的可选项 */
export interface UploadOptions {
  /** 存储目录（拼接在 objectKey 前缀，如 'device-photos'） */
  dir?: string
  /** 自定义文件名（不含路径），默认用 原名+uuid 防冲突 */
  filename?: string
  /** 进度回调 */
  onProgress?: (info: ProgressInfo) => void
  /** 取消信号（AbortController.signal），调用 controller.abort() 中断上传 */
  signal?: AbortSignal
  /** 额外参数（透传给服务器中转接口 / OSS 元信息） */
  data?: Record<string, unknown>
}

/** 上传完成结果 */
export interface UploadResult {
  /** 可访问的 URL（OSS 为签名/永久 URL，服务器中转为返回的 URL） */
  url: string
  /** 存储路径 / objectKey */
  key: string
  /** 文件名 */
  name: string
  /** 字节大小 */
  size: number
  /** 文件 MIME 类型 */
  type: string
}

/** 上传器统一接口（OSS / Server 通道都实现它） */
export interface Uploader {
  /** 上传单个文件 */
  upload(file: File, options?: UploadOptions): Promise<UploadResult>
}

/** createUploader 的配置 */
export interface UploaderConfig {
  /** 上传通道 */
  mode: UploadMode
  /** 是否使用 mock（不调真实后端，用于调试/演示） */
  useMock?: boolean

  /* —— OSS 直传配置（mode='oss' 时需要）—— */
  /** OSS region，如 'oss-cn-hangzhou' */
  region?: string
  /** Bucket 名称 */
  bucket?: string
  /** STS 凭证接口地址（后端颁发临时凭证） */
  stsApi?: string
  /** 访问域名前缀（拼 URL 用，如 'https://cdn.example.com'，不传用 OSS 默认域名） */
  cdnDomain?: string

  /* —— 服务器中转配置（mode='server' 时需要）—— */
  /** 服务器上传接口地址 */
  serverApi?: string
  /** 额外请求头（如鉴权 token） */
  headers?: Record<string, string>
}
