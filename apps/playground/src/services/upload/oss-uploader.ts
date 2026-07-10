/**
 * OSS 直传通道
 *
 * 流程：获取 STS 凭证 → 初始化 ali-oss 客户端 → multipartUpload 直传。
 * 大文件自动分片 + 断点续传，小文件简单 PUT，全程进度回调。
 *
 * 文件不经过自己的服务器，省带宽、速度快；URL 直接来自 OSS/CDN。
 */
import OSS from 'ali-oss'
import type { Uploader, UploadOptions, UploadResult, UploaderConfig, StsCredentials } from './types'
import { getSts } from './sts'
import { mockUpload } from './mock'

/** 生成唯一 objectKey：dir/日期/uuid.ext，避免覆盖与冲突 */
function buildObjectKey(dir: string, filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.'))
  const base = filename.slice(0, filename.lastIndexOf('.')) || filename
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const uid = Math.random().toString(36).slice(2, 10)
  // 仅保留 base 中的安全字符，防注入
  const safeBase = base.replace(/[^\w\u4e00-\u9fa5.-]/g, '_')
  const dirTrim = dir.replace(/^\/+|\/+$/g, '')
  return dirTrim ? `${dirTrim}/${date}/${safeBase}_${uid}${ext}` : `${date}/${safeBase}_${uid}${ext}`
}

export class OssUploader implements Uploader {
  private stsApi: string
  private configFallback: Pick<UploaderConfig, 'region' | 'bucket' | 'cdnDomain'>
  private stsFetcher?: () => Promise<StsCredentials>
  /** 是否 mock 模式（mock 时不真正连 OSS，用模拟进度演示） */
  private useMock: boolean
  /** 缓存的 OSS 客户端（凭证未过期时复用） */
  private client: OSS | null = null
  private clientCred: StsCredentials | null = null

  constructor(config: UploaderConfig, stsFetcher?: () => Promise<StsCredentials>) {
    this.useMock = !!stsFetcher // 传了 mock fetcher 即视为 mock 模式
    // mock 模式不强制要求 stsApi；真实模式仅需 stsApi（region/bucket/cdnDomain 优先从凭证响应取）
    if (!this.useMock && !config.stsApi) {
      throw new Error("OSS 直传需要配置 stsApi（region/bucket/cdnDomain 可由后端 STS 接口返回）")
    }
    this.stsApi = config.stsApi ?? ''
    // config 里的 region/bucket/cdnDomain 仅作兜底（凭证未携带时使用）
    this.configFallback = {
      region: config.region,
      bucket: config.bucket,
      cdnDomain: config.cdnDomain,
    }
    this.stsFetcher = stsFetcher
  }

  async upload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    // mock 模式：获取假凭证（演示流程）后用模拟上传，不真正连 OSS
    if (this.useMock) {
      await getSts(this.stsApi || '/mock/sts', this.stsFetcher)
      return mockUpload(file, options)
    }

    const cred = await getSts(this.stsApi, this.stsFetcher)

    // region/bucket 优先用凭证响应里的（后端返回），否则用 config 兜底
    const region = cred.region ?? this.configFallback.region
    const bucket = cred.bucket ?? this.configFallback.bucket
    if (!region || !bucket) {
      throw new Error('缺少 region/bucket：请由后端 STS 接口返回，或在 createUploader 配置中指定')
    }

    // 凭证变化时重建客户端（缓存复用，避免每次上传都 new OSS）
    if (!this.client || this.clientCred !== cred) {
      this.client = new OSS({
        region,
        accessKeyId: cred.AccessKeyId,
        accessKeySecret: cred.AccessKeySecret,
        stsToken: cred.SecurityToken,
        bucket,
        secure: true, // 强制 HTTPS
      })
      this.clientCred = cred
    }

    // objectKey：优先用凭证里的 dir（后端 RAM 限定目录），再叠加 options.dir
    const dir = options.dir ?? cred.dir ?? ''
    const objectKey = options.filename
      ? `${dir}/${options.filename}`.replace(/\/+/g, '/')
      : buildObjectKey(dir, file.name)

    // 分片上传（大文件自动分片，小文件内部走简单 PUT；自带断点续传能力）
    const result = await this.client.multipartUpload(objectKey, file, {
      progress: (p: number) => {
        if (options.onProgress) {
          options.onProgress({
            loaded: Math.floor(p * file.size),
            total: file.size,
            percent: Math.round(p * 100),
          })
        }
        // 支持取消
        if (options.signal?.aborted) {
          return Promise.reject(new DOMException('上传已取消', 'AbortError'))
        }
        return Promise.resolve()
      },
      // 并发分片数
      parallel: 4,
      // 分片大小（默认自适应，这里给 1MB 起步）
      partSize: 1024 * 1024,
      headers: options.data as Record<string, string> | undefined,
    })

    // 拼访问 URL：优先凭证里的 CDN 域名，其次 config 兜底，否则 OSS 默认域名
    const cdn = cred.cdnDomain ?? this.configFallback.cdnDomain
    const domain = cdn
      ? cdn.replace(/\/+$/, '')
      : `https://${bucket}.${region}.aliyuncs.com`
    const url = `${domain}/${encodeURIComponent(objectKey).replace(/%2F/g, '/')}`

    return {
      url,
      key: objectKey,
      name: file.name,
      size: file.size,
      type: file.type,
    }
  }
}
