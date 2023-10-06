import { AdditionalFields } from '../interfaces';
export const CustomizableFormProps = {
  fields: {
    type: Object as () => AdditionalFields,
    default: (): AdditionalFields => ({})
  },
  responseErrorHandler: {
    type: Function as (...arg: any) => any,
    default: () => () => null
  }
}
