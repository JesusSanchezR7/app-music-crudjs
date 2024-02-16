import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ListCanciones({ id, titulo, artista, album, onUpdate, onSelectSong }) {
  const [isDeleteActive, setIsDeleteActive] = React.useState(false);
  const [newTitulo, setNewTitulo] = React.useState(titulo);
  const [newArtista, setNewArtista] = React.useState(artista);
  const [newAlbum, setNewAlbum] = React.useState(album);

  // Sincronizar los cambios 
  React.useEffect(() => {
    setNewTitulo(titulo);
    setNewArtista(artista);
    setNewAlbum(album);
  }, [titulo, artista, album]);


  async function deleteCanciones(id) {
    try {
      const response = await fetch(`http://192.168.1.68:8080/canciones/${id}`, {
        method: "DELETE",
      });
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar la canción:', error);
    }
  }

  return (
    <TouchableOpacity
      onLongPress={() => setIsDeleteActive(true)}
      onPress={() => setIsDeleteActive(false)}
      activeOpacity={0.8}
      style={[styles.container]}
    >
      <View style={styles.containerTextCheckBox}>
        <Text style={styles.title}> Song: {newTitulo} </Text>
        <Text style={styles.subtittle}>Album: {newAlbum} by {newArtista}</Text>
      </View>
      {isDeleteActive && (
        <Pressable onPress={() => deleteCanciones(id)}>
          <Text>
            <Feather name="trash" size={30} color="#D50000" />
          </Text>
        </Pressable>
      )}
      <Pressable onPress={() => onSelectSong(id, titulo, artista, album)}>
        <Text>
          <Feather name="edit" size={22} color="#32CD32" />
        </Text>
      </Pressable>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 21,
        marginBottom: 10,
        backgroundColor: "#228EEF",
    },
    containerTextCheckBox: {
        flex: 1
    },
    title: {
        fontWeight: "900",
        letterSpacing: 0.5,
        fontSize: 16,
        color: "#ffffff",
    },
    subtittle: {
        color: "#101318",
        letterSpacing: 0.5,
        fontSize: 14,
        fontWeight: "bold",
        color: "#ffffff",
    },
    description: {
        color: "#56636F",
        fontSize: 13,
        fontWeight: "normal",
        with: "100%",
        color: "#ffffff",
    }

});
