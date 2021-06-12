/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Page,
  Document,
  StyleSheet,
  Font,
  View,
  Text,
} from '@react-pdf/renderer';
import { ArticuloOption } from '../../../types/types';

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 25,
    width: 'auto',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: '100%',
  },
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  texto: {
    fontSize: 12,
    fontFamily: 'Lato',
  },
  textoResaltado: {
    fontSize: 12,
    fontFamily: 'Lato Bold',
  },
});

Font.register({
  family: 'Lato',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf',
});

Font.register({
  family: 'Lato Bold',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf',
});

interface ListaImpresaProps {
  articulos: ArticuloOption[];
}
const ListaImpresa = (props: ListaImpresaProps): JSX.Element => {
  const { articulos } = props;

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.container}>
          {articulos.map((articulo) => (
            <Text style={styles.texto}>
              ______________________
              <Text style={styles.textoResaltado}>{articulo.codigo}</Text>
              {`:  ${articulo.nombre}`}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ListaImpresa;
