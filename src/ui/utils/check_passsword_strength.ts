export function checkPasswordStrength( value: string, passwordRules: any = {} ): any {
  value = value ?? '';
  const errors: any = {};
  let { min, max, number, lower_case, upper_case, custom_chars, custom_regexp } = passwordRules;

  lower_case = Number( lower_case );
  upper_case = Number( upper_case );
  number = Number( number );
  if (
    lower_case &&
    !new RegExp( `(?=(.*[a-z])${ lower_case > 0 ? `{${ lower_case },}` : '' })` ).test( value )
  ) {
    errors.lower_case = true;
  }
  if (
    upper_case &&
    !new RegExp(
      `(?=(.*[A-Z])${ upper_case > 0 ? `{${ upper_case },}` : '' })`
    ).test( value )
  ) {
    errors.upper_case = true;
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
  if ( custom_chars &&
    !custom_chars.split( '' ).some( ( char: string ) => value.indexOf( char ) > -1 )
  ) {
    errors.custom_chars = true;
  }

  if ( custom_regexp && custom_regexp.value ) {
    if ( !new RegExp( custom_regexp ).test( custom_regexp.value ) ) {
      return custom_regexp.message || ' ';
    }
  }

  return Object.keys( errors ).length > 0 ? errors : true;
}
