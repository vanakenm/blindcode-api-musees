import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const URL = "https://opendata.bruxelles.be/api/records/1.0/search/?dataset=museums-in-brussels&q="

function buildPaginatedUrl(page) {
  return URL + "&start=" + ((page-1) * 10)
}

export default function App() {
  const [musees, setMusees] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchData() {
    let response = await fetch(URL);
    let data = await response.json();
    setMusees(data.records)
    setTotalResults(data.nhits)
  }

  useEffect(() => {
    fetchData();
  }, [])
  
  let totalPages = Math.ceil(totalResults / 10);
  return (
    
    <View style={styles.container}>
      <View>
        <Text>Vous visionnez la page {currentPage} sur {totalPages} disponibles ({totalResults} musées)</Text>
      </View>
      { musees.map(musee => (
        <Text key={musee.recordid}>{musee.fields.nom_du_musee}</Text>
      ))}
      <Button disabled={currentPage === 1} title="Précédent" onPress={() => setCurrentPage(currentPage - 1)} />
      <Button disabled={currentPage === totalPages} title="Suivant" onPress={() => setCurrentPage(currentPage + 1)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
