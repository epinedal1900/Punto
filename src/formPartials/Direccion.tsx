// import React from 'react';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// import { DigitsFormat } from '../utils/TextFieldFormats';
// import { TextForm, AutocompleteField } from '../components';

// const estados = [
//   '',
//   'Aguascalientes',
//   'Baja California',
//   'Baja California Sur',
//   'Campeche',
//   'Chiapas',
//   'Chihuahua',
//   'Coahuila de Zaragoza',
//   'Colima',
//   'Ciudad de México',
//   'Durango',
//   'Guanajuato',
//   'Guerrero',
//   'Hidalgo',
//   'Jalisco',
//   'Estado de México',
//   'Michoacan',
//   'Morelos',
//   'Nayarit',
//   'Nuevo Leon',
//   'Oaxaca',
//   'Puebla',
//   'Querétaro',
//   'Quintana Roo',
//   'San Luis Potosil',
//   'Sinaloa',
//   'Sonora',
//   'Tabasco',
//   'Tamaulipas',
//   'Tlaxcala',
//   'Veracruz',
//   'Yucatan',
//   'Zacatecas',
// ];

// const Direccion = () => {
//   const matches = useMediaQuery('(min-width:700px)');
//   return (
//     <>
//       <TextForm icono="lugar" lable="Dirección" value="direccion" />
//       <Box mt={2} pl={matches ? 4 : 0} pr={matches ? 1 : 0}>
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <TextForm
//               InputProps={{ inputComponent: DigitsFormat }}
//               // eslint-disable-next-line react/jsx-no-duplicate-props
//               inputProps={{ maxLength: 5 }}
//               lable="Código postal"
//               value="cp"
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <AutocompleteField
//               getOptionsLabel={(option) => option}
//               label="Estado"
//               options={estados}
//               valueName="estado"
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default Direccion;
