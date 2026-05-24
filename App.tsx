
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import axios from 'axios';
import { DDDResponse } from './types'; 

export default function App() {
  // Estados da aplicação
  const [ddd, setDdd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DDDResponse | null>(null);

  // Função assíncrona para buscar os dados na Brasil API
  const handleSearch = async () => {
    // Validação simples de 2 dígitos conforme requisito
    if (ddd.length !== 2 || isNaN(Number(ddd))) {
      Alert.alert('Erro', 'Por favor, insira um DDD válido com 2 números.');
      return;
    }

    setLoading(true);
    setData(null); 

    try {
      const response = await axios.get<DDDResponse>(`https://brasilapi.com.br/api/ddd/v1/${ddd}`);
      setData(response.data);
    } catch (error) {
      Alert.alert('Aviso', 'Não foi possível encontrar dados para este DDD. Verifique se ele existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Consulta de Localidade por DDD</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ex: 11"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={2}
          value={ddd}
          onChangeText={setDdd}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento (Loading status requerido) */}
      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {/* Renderização do resultado após a consulta */}
      {data && (
        <View style={styles.resultContainer}>
          <Text style={styles.stateText}>Estado (UF): <Text style={styles.boldText}>{data.state}</Text></Text>
          <Text style={styles.citiesTitle}>Cidades vinculadas:</Text>
          
          <FlatList
            data={data.cities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.cityCard}>
                <Text style={styles.cityText}>{item}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A1A1A',
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginLeft: 10,
    height: 50,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 30,
  },
  resultContainer: {
    flex: 1,
    marginTop: 10,
  },
  stateText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  citiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cityCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  cityText: {
    fontSize: 15,
    color: '#2D3748',
  },
});