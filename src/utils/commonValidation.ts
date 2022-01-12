/* eslint-disable func-names */
/* eslint-disable react/sort-prop-types */
import { isInteger } from 'lodash';
import * as yup from 'yup';

export const articulosEscanerPreciosValidation = {
  escaneos: yup
    .array()
    .of(
      yup.object().shape({
        qr: yup.string().required('requerido'),
        id: yup.string().required('requerido'),
        tallas: yup.string().required('requerido'),
        piezas: yup.string().required('requerido'),
        nombre: yup.string().required('requerido'),
        cantidad: yup
          .number()
          .required('requerido')
          .min(0.2, 'requerido')
          // @ts-expect-error: err
          .test('integer', 'inválido', function (cantidad) {
            return cantidad && isInteger(cantidad * this.parent.piezas);
          }),
      })
    )
    .test('selected', 'No se debe repetir ningun procesos', (values: any) => {
      const valido = new Set(values).size === values.length;
      return valido;
    }),
  prendasSueltas: yup.array().of(
    yup.object().shape({
      articulo: yup.object().required('requerido').typeError('requerido'),
      cantidad: yup.number().required('requerido').min(1, 'requerido'),
    })
  ),
  precios: yup
    .array()
    .min(1)
    .of(
      yup.object().shape({
        nombre: yup.string().required('requerido'),
        _id: yup.string().required('requerido'),
        precio: yup.number().required('requerido').min(1, 'requerido'),
      })
    ),
};

export const articulosEscanerInventarioValidation = {
  escaneos: yup
    .array()
    .of(
      yup.object().shape({
        qr: yup.string().required('requerido'),
        id: yup.string().required('requerido'),
        tallas: yup.string().required('requerido'),
        piezas: yup.string().required('requerido'),
        nombre: yup.string().required('requerido'),
        cantidad: yup
          .number()
          .required('requerido')
          .min(1, 'requerido')
          // @ts-expect-error: err
          .test('integer', 'inválido', function (cantidad) {
            return cantidad && isInteger(cantidad * this.parent.piezas);
          }),
      })
    )
    .test('selected', 'No se debe repetir ningun procesos', (values: any) => {
      const valido = new Set(values).size === values.length;
      return valido;
    }),
  prendasSueltas: yup.array().of(
    yup.object().shape({
      articulo: yup.object().required('requerido').typeError('requerido'),
      cantidad: yup.number().required('requerido').min(0, 'requerido'),
    })
  ),
};

export const cuentaValidation = yup.lazy((value) => {
  switch (typeof value) {
    case 'object':
      return yup.object().when('tipoDePago', {
        is: 'deposito',
        then: yup.object().required('requerido'),
      });
    case 'string':
      return yup.string().when('tipoDePago', {
        is: 'deposito',
        then: yup.string().required('requerido'),
      });
    default:
      return yup.mixed();
  }
});
