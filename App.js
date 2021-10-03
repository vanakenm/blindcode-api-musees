import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const URL = "https://opendata.bruxelles.be/api/records/1.0/search/?dataset=museums-in-brussels&q="

// From the page number, returns an URL with the proper value of "start"
// Ex: if we want page 2, we'll get (2-1) * 10 = 10 as "start" value
function buildPaginatedUrl(page) {
  return URL + "&start=" + ((page-1) * 10)
}

export default function App() {
  // Store the array of museums
  const [musees, setMusees] = useState([]);

  // Store the total number of results
  const [totalResults, setTotalResults] = useState(null);

  // Store the current page (starts at 1)
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
  
  // Compute the total number of pages available
  // by dividing the number of results by the size of the page
  let totalPages = Math.ceil(totalResults / 10);
  return (
    
    <View style={styles.container}>
      <View>
        <Text>Vous visionnez la page {currentPage} sur {totalPages} disponibles ({totalResults} musées)</Text>
      </View>
      { musees.map(musee => (
        <Text key={musee.recordid}>{musee.fields.nom_du_musee}</Text>
      ))}

      {// The button to go to the previous page is disabled if the current page is one
      }
      <Button disabled={currentPage === 1} title="Précédent" onPress={() => setCurrentPage(currentPage - 1)} />
      {// The button to go to the next  page is disabled if the current page is the last page
      }
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
