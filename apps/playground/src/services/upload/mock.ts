/**
 * Mock 后端接口
 *
 * 不依赖真实后端即可跑通完整上传流程，便于调试与演示。
 *  - mockSts：返回一份假 STS 凭证（15min 后过期）
 *  - mockUpload：模拟上传过程（按进度回调推进，延时后返回 URL）
 *
 * 切到真实后端时，createUploader({ useMock: false }) 即可，业务代码无需改动。
 */
import type { StsCredentials, UploadOptions, UploadResult } from './types'

/** 生成 mock STS 凭证（15 分钟后过期，附带 region/bucket/cdnDomain 演示完整响应） */
export function mockSts(): Promise<StsCredentials> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        AccessKeyId: 'STS.mock-access-key-id',
        AccessKeySecret: 'mock-access-key-secret',
        SecurityToken: 'mock-security-token-' + Math.random().toString(36).slice(2),
        Expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        dir: 'mock-uploads',
        // 附带 bucket 连接信息（真实场景由后端 STS 接口一并返回，前端无需配置）
        region: 'oss-cn-hangzhou',
        bucket: 'mock-bucket',
        cdnDomain: 'https://cdn.example.com',
      })
    }, 300) // 模拟网络延时
  })
}

/**
 * 模拟上传：用 setInterval 推进进度，完成后返回 mock URL。
 * 用于 server 通道的 mock（OSS 通道在无真实 OSS 时也可降级用此逻辑演示）。
 */
export function mockUpload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    let loaded = 0
    const total = file.size || 1024 * 100
    // 每次推进的步长（模拟按总大小分 ~20 步完成）
    const step = Math.max(total / 20, 1024)
    const timer = setInterval(() => {
      loaded = Math.min(loaded + step, total)
      options.onProgress?.({
        loaded,
        total,
        percent: Math.round((loaded / total) * 100),
      })
      if (loaded >= total) {
        clearInterval(timer)
        const uid = Math.random().toString(36).slice(2, 8)
        const dir = options.dir ?? 'mock-uploads'
        const result: UploadResult = {
          url: `https://cdn.example.com/${dir}/${uid}_${file.name}`,
          key: `${dir}/${uid}_${file.name}`,
          name: file.name,
          size: file.size,
          type: file.type,
        }
        resolve(result)
      }
    }, 120)

    // 支持取消
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        clearInterval(timer)
        reject(new DOMException('上传已取消', 'AbortError'))
      })
    }
  })
}
