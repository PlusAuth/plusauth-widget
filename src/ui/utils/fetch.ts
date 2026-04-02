import { version } from '../../../package.json'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, any>,
  query?: Record<string, any>
}

export type FetchWrapper = Record<
  'get' | 'post' | 'patch' | 'delete',
  (
    endpointOrOptions: string | RequestOptions,
    options?: RequestOptions
  ) => Promise<any>
>;

const toQueryString = params => !params ? '' : `?${Object.entries(params)
  .map(
    ([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`
  )
  .join('&')}`;

export function createFetchWrapper(baseUrl?: string) {
  baseUrl = baseUrl || window.location.origin;
  const http: FetchWrapper = {} as any

  ['get', 'post', 'patch', 'delete'].forEach(method => {
    http[method] = function (
      endpointOrOpts: string | RequestOptions,
      options: RequestOptions
    ) {
      const currentUrl = new URL(window.location.href);
      const url = typeof endpointOrOpts === 'string' ? endpointOrOpts
        : currentUrl.pathname;
      options = options || endpointOrOpts
      const fetchOptions: RequestInit = Object.assign({}, options as any || {}, {
        method,
        credentials: 'include',
      })

      fetchOptions.headers = Object.assign({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': `${navigator.userAgent} PlusAuthWidget/${version}`
      }, fetchOptions.headers || {})

      if (fetchOptions.body) {
        fetchOptions.body = JSON.stringify(fetchOptions.body)
      }
      return new Promise(function (resolve, reject) {
        fetch(`${baseUrl}${url}${toQueryString({
          ...Object.fromEntries(currentUrl.searchParams.entries()),
          ...options.query,
        })}`, fetchOptions).then(rawResponse => {
          const contentType = rawResponse.headers.get('content-type')
          if (rawResponse.redirected && contentType && contentType.includes('html')) {
            window.location.assign(rawResponse.url)
            return false;
          }
          let response: any = null
          rawResponse.text().then(value => {
            if (contentType && contentType.includes('json')) {
              response = JSON.parse(value)
            } else {
              // noinspection JSPrimitiveTypeWrapperUsage
              response = value && new String(value)
            }
            if (rawResponse.ok) {
              resolve(response)
            } else if (
              rawResponse.status === 400
              && response.error === 'xhr_request'
              && response.location
            ) {
              window.location.replace(response.location);
              return false;
            } else {
              // noinspection JSPrimitiveTypeWrapperUsage
              const errorResponse = response || {
                error: rawResponse.statusText,
              }
              Object.defineProperty(errorResponse, '$raw', {
                value: rawResponse
              })
              reject(errorResponse)
            }
          })
        }).catch(reject)
      })
    }
  })
  return http
}
