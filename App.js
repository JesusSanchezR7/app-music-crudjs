import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import ListCanciones from './components/Canciones';
import { Feather } from "@expo/vector-icons";

export default function App() {
  // TOMAR
  const [canciones, getCanciones] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await fetch("http://192.168.1.68:8080/canciones/");
    const data = await response.json();
    getCanciones(data);
  }
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

 
  // CREEAR
  const Creearcancion = async () => {
    // Verificar si los campos obligatorios están llenos
    if (!formData.titulo || !formData.artista || !formData.album) {
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.68:8080/cancion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchData();
        setFormData({ titulo: '', artista: '', album: '' });
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };
  
  // manejar los valores del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    artista: '',
    album: ''
  });
  
  //ELIMINAR  
  async function EliminarCanciones(id) {
    await fetch(`http://192.168.1.68:8080/canciones/${id}`, {
      method: "DELETE",
    });
    fetchData(); // Actualizar la lista después de eliminar
  } 
   
  //ACTUALIZAR
  const [selectedSongId, setSelectedSongId] = useState(null);
  const handleUpdateCancion = async () => {
    // Verificar si los campos obligatorios están llenos
    if (!formData.titulo || !formData.artista || !formData.album) {
        alert('Datos incompletos');
        return;
    }
    try {
        const response = await fetch(`http://192.168.1.68:8080/canciones/${selectedSongId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: selectedSongId, titulo: formData.titulo, artista: formData.artista, album: formData.album }),
          });
        if (response.ok) {
            fetchData();
            setFormData({ titulo: '', artista: '', album: '' });
            setSelectedSongId(null);
        }
    } catch (error) {
        console.error('Error al actualizar la canción:', error);
    }
  };

  const Seleccancion = (id, titulo, artista, album) => {
    setSelectedSongId(id);
    setFormData({ titulo, artista, album });
  };
  
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Agregar una Nueva Canción, Manuel</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={formData.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Artista"
          value={formData.artista}
          onChangeText={(text) => handleInputChange('artista', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Álbum"
          value={formData.album}
          onChangeText={(text) => handleInputChange('album', text)}
        />
        <TouchableOpacity
          onPress={selectedSongId ? handleUpdateCancion : Creearcancion}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {selectedSongId ? 'Actualizar Canción' : 'Agregar Canción'}
          </Text>
        </TouchableOpacity>

        </View>



        <FlatList
         data={canciones}
         keyExtractor={(cancion) => cancion.id.toString()}
         ListHeaderComponent={() => 
         <Text style={styles.title}>Tu Lista de Canciones    <Feather onPress={() => fetchData(true)} name="refresh-cw" size={25} color="#2FDEBE" /></Text> }
         renderItem={({item}) => <ListCanciones {...item} clearCanciones={EliminarCanciones} onUpdate={Creearcancion}  onSelectSong={Seleccancion}  />} 
         contentContainerStyle={styles.contentContainerStyle} // HACE QUE NO SE HAGAN TODA LA PANTALLA 
       />
       
      </SafeAreaView>
       <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainerStyle:{
    padding: 15,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 15,
  },
  // formulario 
   formContainer: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 10,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2FDEBE',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
