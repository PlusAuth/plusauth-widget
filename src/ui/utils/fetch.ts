export type FetchWrapper = Record<
'get' | 'post' | 'patch' | 'delete',
(endpoint: string, options?: RequestInit) => Promise<any>
>;

const toQueryString = params => !params ? '' : `?${Object.entries(params)
  .map(
    ([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`
  )
  .join('&')}`;

export function createFetchWrapper() {
  const baseUrl = window.location.origin;
  const http: FetchWrapper = {} as any

  ['get', 'post', 'patch', 'delete'].forEach(method => {
    http[method] = function (
      endpoint: string,
      options: RequestInit & { body?: object, query?: object }
    ) {
      const fetchOptions: RequestInit = Object.assign({}, options || {}, {
        method,
        credentials: 'include',
      })

      fetchOptions.headers = Object.assign({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }, fetchOptions.headers || {})

      if (fetchOptions.body) {
        fetchOptions.body = JSON.stringify(fetchOptions.body)
      }

      const url = `${baseUrl}${endpoint}${toQueryString(options.query)}`
      return new Promise(function (resolve, reject) {
        fetch(url, fetchOptions).then(rawResponse => {
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
              response = value
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
              reject(response ? response : rawResponse.statusText)
            }
          })
        }).catch(reject)
      })
    }
  })
  return http
}
