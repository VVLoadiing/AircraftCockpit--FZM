/**
 * STS 凭证获取与缓存
 *
 * 后端通过 /api/upload/sts 颁发阿里云 STS 临时凭证（15min 有效）。
 * 前端缓存凭证，在过期前 1 分钟自动刷新，避免每个文件都请求一次后端。
 *
 * 安全：凭证是临时的（RAM 最小权限，仅允许 PutObject 到指定目录），
 * 即使被截获，攻击者也只能在有效期内往限定目录传文件，无法删/读。
 */
import type { StsCredentials } from './types'

/** 凭证缓存 */
let cached: StsCredentials | null = null
/** 进行中的请求（防止并发重复请求） */
let pending: Promise<StsCredentials> | null = null

/**
 * 判断凭证是否已过期或即将过期（提前 1 分钟视为过期，留刷新时间）。
 */
function isExpired(cred: StsCredentials | null): boolean {
  if (!cred) return true
  const exp = typeof cred.Expiration === 'number' ? cred.Expiration : Date.parse(cred.Expiration)
  if (!exp || Number.isNaN(exp)) return true
  // 提前 60s 视为过期
  return Date.now() >= exp - 60 * 1000
}

/**
 * 获取有效凭证：有缓存且未过期则直接返回，否则请求后端。
 * @param stsApi 后端 STS 接口地址
 * @param fetcher 可选的自定义请求函数（mock 用），默认 fetch
 */
export async function getSts(
  stsApi: string,
  fetcher?: () => Promise<StsCredentials>,
): Promise<StsCredentials> {
  // 缓存有效，直接复用
  if (!isExpired(cached)) {
    return cached!
  }

  // 已有进行中的请求，复用（防并发）
  if (pending) return pending

  pending = (async () => {
    try {
      const cred = fetcher ? await fetcher() : await fetchSts(stsApi)
      cached = cred
      return cred
    } finally {
      pending = null
    }
  })()

  return pending
}

/** 默认通过 fetch 请求后端 STS 接口 */
async function fetchSts(stsApi: string): Promise<StsCredentials> {
  const res = await fetch(stsApi, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`获取 STS 凭证失败：HTTP ${res.status}`)
  }
  const json = await res.json()
  // 约定后端返回 { code, data: StsCredentials } 或直接 StsCredentials
  const cred: StsCredentials = json.data ?? json
  if (!cred.AccessKeyId || !cred.AccessKeySecret || !cred.SecurityToken) {
    throw new Error('STS 凭证字段缺失')
  }
  return cred
}

/** 清除缓存（切换用户/登出时调用） */
export function clearStsCache() {
  cached = null
  pending = null
}
