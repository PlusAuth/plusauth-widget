import PlusAuthWidget from './src';

globalThis.PlusAuthWidget = window.PlusAuthWidget = PlusAuthWidget

if (!window.PlusAuth) {

  window['PlusAuth'] = {
    params: {
      ui_locales: 'tr en',
      state: '018f00d8-bfd5-731a-b23f-738dfdd28b40'
    },
    client: {
      clientName: 'TestApp',
      tosUri: 'https://sometosuri.com',
      policyUri: 'https://somepolicyuri.com',
      logoUri: 'https://static.plusauth.com/images/logo.png',
      social: [
        { name: 'google-connection', provider: 'google' },
        { name: 'facebook-connection', provider: 'facebook' },
      ]
    },
    settings: {
      register_enabled: true,
      forgot_password_enabled: true,
      password_policy: {
        min: 4,
        max: 16,
        lower_case: 4,
        history: 5
      }
    },
    prompt: {
      // mode: 'check_email'
    },
    // error: {
    //   error: 'invalid_password'
    // },
    details: {
      // dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAADuNJREFUeF7tndGW2zgMQzv//9Hd403P2unYIi8FWs4s+lqaokCApDSJ8/Xr16/fvz7k3+/f56F+fX1JdqDyr/KzbYr6UtlfAXqF9dW61I8kkUInG7MskD+AUnJd5UHlxwIRMr3oygI5AKcitsqPBVJktfAxC8QCQXTyiIXgutdYWZnPIlf5V/lxB7mXX2eruYO4gyAWuoMguO41VlZmd5AXAqrbJ5WfexkVrzbsIHTT8XI5C1WVyq0WW628RlYVhe5c0pxR+zhLcxZX8VggCVwtkBgkSnhqH0cwZ2GBTOBngcTgUcJT+ziCOQsLZAI/CyQGjxKe2scRzFlYIBP4WSAxeJTw1D6OYM7CApnAzwKJwaOEp/ZxBHMWUoGsIgy9iaFJoPuiN0w0/i3lNKYrmtBYKd3o3rpzo8KhdIu1KmlPSwIlHY3fAtlpvopzFsih1NAkWCA7eFT87iCJHt1NsO4kdMfvDuIOciojSuwrLVI/7iCJqnZh4g4yMYqoDkxPS4I7iEcsVOFp/VER7ImVn2BB499802JBu2x3Uevu7qr4f8QhnRJMJUwigpEtjd8CqSNPc2+BJEZHVbVWVXELxAI5RYCqX9VmLZD4rKEamVQ5VuXeHcQdBJVjSuBuexR84TVKFogFgjjWTXjqHwVvgeTgoiMTPUR3+x+dQVaNOqo9WyAHDlMwqD2dQ1WHaBVZRnKnWKyyp5jSOHMlsX6G8oiVQNgdZAeJdigLJEEwWslpEp5GYHeQmBTdOVZxzh0kziX+ToYFEoNqgcQYtb+5nFYROg6s8u9DeoJcFyb0jFPqIPXwck92Vxda4VXCqQiKYrEqVhontc8xp24l/cptPYzckxS87jPIKtJt61IsVsVK46T2OebUrSyQA3buIHUi0RFFZV+POPekBWKB5JgSWKkI7w4ykQ4KnkesGGyKET0vqXKm6u4xIu8W7iDuIJQzp/buIBIYe5ysSk53dRxV9//jnnvYU/P6o39A59PJtaX00/dA46/RuO8pCyQxermD7CBRwlP7PqrXPFsgFsgpc1YWhRqVe56yQCwQC2SgLQvEArFARgL5veriWdgRVXf89O5fuIVLV917o3um8Xw6vb4skJjmK5NMCRnvJmehOlyvxC6307GVBZJAcWWSLZBEghpNLJAEuBbIDhIV7ErsEqkNTSyQECLde3ATS30zoYSsrHH2jEesFyoWSIJRK6ugBZJIUKPJLd8oVP3RieJAiU3JqPI/8kOxoxip9kz90DipvSo3FsgBeZpkVRIsEEr/2F6VGwvEAonZdrBQnU3QogVjCyQBmgqkq6VU/t1BEsmEJqrcuIO4gyDquYMk2ilCtPBmDnoW6K7w3f7dQSijYvulHYTerFDCqzan8kMFotwvxfoqVhpTTMF3C9pZuu1pzi5x2760Rp3RpNHkqIit8qPCh/rZ7CnWFshY2pgTFsgOqErIKj8WyJ4b2nEqxejsmdIhnVY1JWFON/G1beP7P1wtLvxQsJX7pVi7g7iDfENgFYnuqGqr9uYzyAsBd5ADE1SVX+XHI9bDR6xPqSI0zk+pytu+aJdS2dNRrXvdVfFIv5OuAklFYBWo1A8V7Mj+aZjS3FB7ih31j+1Ht1g02KclkxK7+1BP8XQHiRHDhIcXOu4ghxxYIOsJGUfwbmGBTBDYHWRHgBJJhZ1q3VXxuINMCJDeVtHq6BErRowKENuPXvtDCUBHlHj7PRYYJNEfEHt2kxs5rtam50bVHlZxhXJ6+J106mzVpmnSLJAdMQtkzB4LJDFifVKhUMVK/dAitaqY0n1ZIBbIKbcpkSyQBAKrqkIitDcTj1gesbKccQdxB3EHGahF+mFFelOiutvOVoPITjVWKA++tCvT7khzsCrHNDeqHFggh4zTJFCyVPxbIC+UKXYWSNQOCv9Pk2CBxGcZ2qFUxFb5cQdxB5GcQbo7HS1eFkihQ0SP0CS4g7iDfER1iYif/X8LZEeKYuEO0jCK0ArcPc+q2rJqXyNhUwKrYlLdknXnUrZf5Wt/spU6sltVjSyQKDO693RZIDHWlxYWSAyeO8gLI4oD5pY7SHzQpElQtXePWPrcWCAHVtGRidrHdf7dgibHArFATjlAiUQPjip7CyQmMMWoOzeYW6NvFHZvTnVQ645TNWLdMXqpMO3eM80ZxY7Gfzk9WCBxFaRg0+TTqkb9jw6z3WNlJVbyjCp+C+SAencbJwnebC0Qipi+qFkgFgg673V3zbokchcfNH4LxAKxQAaqtEAsEAtELRBZm2p+r5QqTtUNEPWjGjcq5xl6HqN7u+N8pcTvb1+3fCd9FYHp1WB38ikOlcRTQlogY5QtkAQLu0mUCCFtYoGkoUoZWiAJmCyQGCQVRvFK91pYIAm8Vcn3iJUA+2EmFkgiIRZIDJIKo3iley2kAqGH4u6KSufxe6HPrUaJp7LPRRdb0Y+CqOxVFy4WSJzjpRYqwlPiqTZN11XZWyCJDLqD7CBR4iXgTZnQdVX2FkgiPRaIBfI3TXBHVv7ClM8gCdVCE5xQ+iuu8FMOMPzP/513C4Sm/F57C+SFN8XBI1aCpx6xPGK1jlgJDk6ZqKoCDeJp647iVx1a6Z7pFbwqTlUu6bh/2XGUX7lVba678lOy0H3R9m6B1BFWCdkCOSBggehHL3eQusgvn3waUVd1LneQOrncQerYfYwwLZB6ki2QOnYWyMRYqSJe95SgivPyDDJ6Ny/lJh1RujdH46fx0JuSClkqz5zFpdobxZRygvqn+GB7C2RPiYpEygMrTajyBo2S9czeAjmgQsGghKT+aYJpPO4gMcKrcqYqUsMf8Yy3/25BwaCEpP5p/DQeCyRGeFXOLJA4N9jCAsGQhQ9YIB6xvpFEVb02xz6DjDVI8cH2dxzSaVBhWfrLQFX56cj0tAPxFg+t2DQ3KnsV1t1cueUMQkHt3jT1ryIdXbdir4pV1QVp8aLxU4xoPBZIAmGaNJqERAhpE1WsFsgLcgskQT0V6RJLTZuoYrVALJA0GVWkSy84YaiK1QKxQNI0VJEuveCEoSpWC2RCIBS8iXy/PUrXVdl331ZRUv87G4tetlBZ+wwPehGjsqe3YRS30hmEEs8CGSNQISlNNCUSzZmK8CpuqfxYIAcmUKKuJOnKtd1BgvKhUietUnRdlb1HrDhT7iCJSquqanQc6E6OBWKBxAhYIN8wUhUEOtr5kB7TlU4Pl0Vw9FksmjhayeNtvluo/KuITeNXJW1bl/pS5ZJ2d4oRzXG7vQVCU1i3p6QerUR9WSAvNLGgLJA64emTlNQWyI4AxU5mb4FQmtftadIsEAsEsY22x+7bJxR84dxggVggiGMWiJ4wqiJCzzh0Xdp9ZfaVl1fTWyAaLL0pofFQ/6pkUj93dBBadFRYo8o4MG7nlgUSV2VKbFpNK6SjxOi2VxGe+qH7osVx+Cu3lBh4cfiJVBUYNE6KgwVCaV63V3Hi0o87iDvIGT1VxKtTP/ekKk4LJIG3qvKr/PgMEifNAjlgpALDI9aOgA/pLyxu6SAqAtMKTM8IVCCURHHdy1tUDvB579xSleNVOaC5lB7SVeBZIHGF59TWPKHKsQVyQIBWQQvEAvlbQLTy06nCI1aigNLqqBLyKDRaXBLbnDKhGNHFqH+aAyo0j1gTlwA0OZQsm70F8kKNEtsdJME2Sq7u6pUI+ZsJ3UNlDfIMxYj43mypf1qkqNCkbzWhYNDkU/BoPNQ/tacHU2XllFVU+OkHmgOVPRXOJT6Vnz+QLQ7BVhGSEhVXHdG+LJC6XGQctUD2JFABUnsqTAvEAkEIqAhJieoOsiNGx2KUYKGxO8gBTFXSqACpPRWmO0hdMRaIBVJnTwI7lfglQRacyARS+bh7Id7WR1aOQGRjqk43WrOb2NS/jKgXFx/d8ZT+UEhIcYetBVK/aKD56Sbk5XWrBUJTFR8caTIrZwQStTsIQevdVlUEaUdzB0nkjIJKq2AihLSJqijQYkEJnN7QH0Pqn9pf5sxnkDhVFkh9hOvGjhYEGo87SKyPy88HJR59M/GIRRHTj9FYIJW/pNe3Ofdkd7WYiy5OZsW/as+qkYOOj93xd4+CpQ8rVhKteEYFtiKWkQ9lp1Dt2QJ5ZYziYIE0qMUC0Z9ZKKaywuIRS68QmsxRBLJEw78jUFRwZYbxUExluFkglAqxPU2mBVLvOD6DHBBQVYWY4nMWFkid8DTHSwVCr8TmaBXfAtF4aNtXxf9EPxSLbnuKES06VGiX9spfmKKbVl0ZdvtR7Wuln27CU/8UCwvkgJgKbJUfmswn2lMsuu0pRhaIBUI5g+y7CU/9o+ALrz/yiJVAuDtpiRAeY0Kx6LanwLiDuINQziD7bsJT/yj4T+sgVM3tV3Hwj040OdRehc+27qqbO0p45Z4p3mf2dMS6vOip3GKpwKCbUNkrEjDyocLHAqlninLFAqljjZ+0QDBk8gcskIYziypLFogKybofC8QCOWUPPTtcjhbwXKcsCnVZ7E9aIBaIBTJQkgWSKDO0mqrs6a1dYivfTLorNiVY923bqtwMvzBFQaKJpv5/ahIobpu9BfJCjXKIFi8LZGJUoySlAr/rKvlsHUo8ujdVR6BxWiANhO9OgjtI/XDdnRt3kAZB0SplgVggpxyg6v+pbdwCsUCWCER1x0/9UMJT4Y8O6aqi032+ov4ppqou/qNHLEpsSlRVkum6FkhdLhRrC+SANQYP/linqqpZIBYIGskoXPSKkXYiGg8VpgVCEY7POJc5/gkfd6dwWSAxYej4SEVO/dMcq7q1RyyPWKdcogS2QFQSTvhRVfjEUlMmNE5KukpwTyOqKh7qp4Ld2TOlDqJanM72q0BSxWmBxMyhRSf2OGdhgUzgR5NpgcRgU0xjj3MWFsgEfjSZFkgMNsU09jhnYYFM4EeTaYHEYFNMY49zFhbIBH40mRZIDDbFNPY4Z/Gjf2FqDpr608rLBEqYbnvVhQVFl+5L5d8CoUgm7C2QHSQVFhbIBPHuGF0S4f1noiLF5pASo9veHYQw4WZb+lHum8OzQE4AVxULKnya+yv/HrEokgl7FSncQXawLZAJ4nnEqhNJRTyVn6eNcP8ArVHL1OUyEKoAAAAASUVORK5CYII=',
      // secret: 'ASFG$E@WRF$ERF$EFG$REG',
      merge_context: {
        type: 'password',
      },
      merge_with: {
        name: 'test'
      },
      user: {
        name: 'existing user'
      },
      push_code: '02',
      phone_number: '+90********23',
      scopes: {
        new: ['read:a', 'write:subscription', 'write:user', 'read:user']
      },
      tenantLoginUrl: 'http://dashboard.plusauth.com',
      email: 'test@plusauth.com',
      fields: [
        {
          name: 'email',
          type: 'text',
          format: 'email'
        }
      ],
      resent: true,
      resend_after: 60000,
      challenges: [
        'sms',
        'email',
        'otp',
        'sc',
        'webauthn',
        'fv'
      ]
    }
  }
  const auth = new PlusAuthWidget('#pa__app', {
    locale: {
      locales: {
        'tr': { label: 'Turkce', codes: ['tr'] },
        'en': { label: 'English', codes: ['en'] },
      },
      defaultLocale: 'en',
      dictionary: {
        tr: {
          errors: {
            field_required: 'Alan zorunlu'
          },
          common: {
            edit: 'Degistir'
          },
          login: {
            signIn: 'Giris yap'
          }
        }
      }
    },
    footer: {
      enabled: true
    },
    // socialLogin: {
    //   buttonVariant: 'circle' // 'block' by default
    // },
    modeOptions: {
      login: {
        fields: {
          email: null,
          username: {
            type: 'text',
            label: 'Username',
            placeholder: 'Enter your username',
            attrs: {
              autocomplete: 'email'
            },
          },
        }
      },

      signup: {
        fields: {
          username: undefined,
          email: {
            type: 'text',
            label: 'Email',
            attrs: {
              autocomplete: 'email'
            },
          },
        }
      }
    }
  }, window['PlusAuth'])

  // setTimeout(() => {
  //   auth.view.modeOptions.login!.fields!.username!.value = 'test@test.com'
  //   auth.view.modeOptions.login!.fields = {
  //     username: null,
  //     email: {
  //       type: 'text',
  //       label: 'Email',
  //       attrs: {
  //         autocomplete: 'email'
  //       },
  //     },
  //   }
  //
  // }, 200)
  // auth.view.mode = 'mfapush'
}
