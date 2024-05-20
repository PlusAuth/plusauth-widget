import type { IPlusAuthContext } from '../interfaces';

export function useResend(context: IPlusAuthContext){
  const resendLink = `${ window.location.pathname }/resend`
  const resendAfter = context.details.resend_after
  return {
    resendLink
  }
}
