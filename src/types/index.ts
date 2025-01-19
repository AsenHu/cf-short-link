export interface shortLinkAdd {
  url: string
  length?: number
  number?: boolean
  capital?: boolean
  lowercase?: boolean
  expiration?: number | null
  expirationTtl?: number | null
}

// url	string	必填：需要缩短的长链接	无
// length	number	可选：短链接的长度	6
// number	boolean	可选：是否包含数字	true
// capital	boolean	可选：是否包含大写字母	true
// lowercase	boolean	可选：是否包含小写字母	true
// expiration	number	可选：链接的过期时间戳	无
// expirationTtl	number	可选：链接的存活时间（秒）	无

export interface shortLinkInstance {
  key: string
  noHttps: string
  full: string
  url: string | null
  expiration: number | null
}

export interface shortLinkEdit {
  key: string
  url: string
  expiration: number | null
  expirationTtl: number | null
}
