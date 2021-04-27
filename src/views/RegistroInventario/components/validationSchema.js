import * as yup from 'yup'

const validationSchema = [
  yup.object({
    puntoId: yup.object().required('Campo requerido')
  }),
  yup.object({
    articulos: yup.array()
      .of(yup.object().shape({
        articulo: yup.object().required('requerido'),
        cantidad: yup.number().required('requerido').min(1, 'requerido'),
      }))
      .test(
        'selected',
        'Ingrese al menos 1 artículo',
        (values) => values.length > 0
      )
  }),
  yup.object({
    comentarios: yup.string()
  })
];

export default validationSchema