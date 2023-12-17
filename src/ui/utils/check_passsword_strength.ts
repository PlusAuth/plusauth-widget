export function checkPasswordStrength( value: string, passwordRules: any = {} ): any {
  value = value ?? '';
  const errors: any = {};
  // eslint-disable-next-line prefer-const
  let { min, max, number, lowerCase, upperCase, customChars, customRegexp } = passwordRules;

  lowerCase = Number( lowerCase );
  upperCase = Number( upperCase );
  number = Number( number );
  if (
    lowerCase &&
    !new RegExp( `(?=(.*[a-z])${ lowerCase > 0 ? `{${ lowerCase },}` : '' })` ).test( value )
  ) {
    errors.lowerCase = true;
  }
  if (
    upperCase &&
    !new RegExp(
      `(?=(.*[A-Z])${ upperCase > 0 ? `{${ upperCase },}` : '' })`
    ).test( value )
  ) {
    errors.upperCase = true;
  }
  if (
    number &&
    !new RegExp(
      `(?=(.*[0-9])${ number > 0 ? `{${ number },}` : '' })`
    ).test( value )
  ) {
    errors.number = true;
  }
  if ( min != null && value.length < min ) {
    errors.min = true;
  }
  if ( max != null && value.length > max ) {
    errors.max = true;
  }
  if ( customChars &&
    !customChars.split( '' ).some( ( char: string ) => value.indexOf( char ) > -1 )
  ) {
    errors.customChars = true;
  }

  if ( customRegexp && customRegexp.value ) {
    if ( !new RegExp( customRegexp ).test( customRegexp.value ) ) {
      return customRegexp.message || ' ';
    }
  }

  return Object.keys( errors ).length > 0 ? errors : true;
}
