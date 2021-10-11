import * as yup from "yup"

export const createFileSchema = yup.object({
  filename: yup.string().required("Please specify 'filename' parameter"),
  content: yup.string().required("Please specify 'content' parameter")
}).required('Nead body')