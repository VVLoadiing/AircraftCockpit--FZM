/**
 * 服务器中转上传通道
 *
 * 流程：前端 FormData POST 文件到 serverApi，后端接收后转存 OSS / 存本地 / 处理（压缩/鉴毒），
 * 返回 { url, key, name }。
 *
 * 适合：需后端处理、小文件、或无 OSS 直传条件的场景。
 * 大文件会占服务器带宽，OSS 直传通道（OssUploader）更适合大文件。
 *
 * 用原生 XMLHttpRequest 以拿到 upload progress（fetch 的进度支持不全）。
 */
import type { Uploader, UploadOptions, UploadResult, UploaderConfig } from './types'

export class ServerUploader implements Uploader {
  private serverApi: string
  private headers: Record<string, string>
  /** 可选的自定义请求函数（mock 用） */
  private fetcher?: (file: File, options: UploadOptions) => Promise<UploadResult>

  constructor(
    config: UploaderConfig,
    fetcher?: (file: File, options: UploadOptions) => Promise<UploadResult>,
  ) {
    if (!config.serverApi && !fetcher) {
      throw new Error("服务器上传需要配置 serverApi（参见 UploaderConfig）")
    }
    this.serverApi = config.serverApi ?? ''
    this.headers = config.headers ?? {}
    this.fetcher = fetcher
  }

  upload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    // mock 模式
    if (this.fetcher) return this.fetcher(file, options)

    return new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)
      // 透传额外参数
      if (options.dir) formData.append('dir', options.dir)
      if (options.filename) formData.append('filename', options.filename)
      if (options.data) {
        for (const [k, v] of Object.entries(options.data)) {
          formData.append(k, String(v))
        }
      }

      // 上传进度
      if (options.onProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            options.onProgress!({
              loaded: e.loaded,
              total: e.total,
              percent: Math.round((e.loaded / e.total) * 100),
            })
          }
        }
      }

      // 取消
      if (options.signal) {
        options.signal.addEventListener('abort', () => xhr.abort())
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText)
            // 约定后端返回 { code, data: UploadResult } 或直接 UploadResult
            const result: UploadResult = json.data ?? json
            resolve(result)
          } catch {
            reject(new Error('服务器返回数据解析失败'))
          }
        } else {
          reject(new Error(`服务器上传失败：HTTP ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('网络错误，上传失败'))
      xhr.onabort = () => reject(new DOMException('上传已取消', 'AbortError'))

      xhr.open('POST', this.serverApi)
      // 鉴权等自定义头
      for (const [k, v] of Object.entries(this.headers)) {
        xhr.setRequestHeader(k, v)
      }
      xhr.send(formData)
    })
  }
}
