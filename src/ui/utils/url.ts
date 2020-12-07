export function parseQueryUrl( value: string ) {
  const result: Record<string, string> = {};
  value = value.trim().replace( /^(\?|#|&)/, '' );
  if(!value){
    return null
  }
  const params = value.split( '&' );
  for ( let i = 0; i < params.length; i += 1 ) {
    const paramAndValue = params[i];
    const parts = paramAndValue.split( '=' );
    const key = decodeURIComponent( parts.shift()! );
    const value = parts.length > 0 ? parts.join( '=' ) : '';
    if(key)
      result[key] = decodeURIComponent( value );
  }
  return result;
}
