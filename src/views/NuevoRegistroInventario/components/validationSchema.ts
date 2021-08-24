import * as yup from 'yup';
import { articulosEscanerInventarioValidation } from '../../../utils/commonValidation';

const validationSchema = [
  yup.object(articulosEscanerInventarioValidation),
  yup.object({
    comentarios: yup.string(),
  }),
];

export default validationSchema;
