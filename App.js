import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons} from '@expo/vector-icons';
import { handleUpload } from './api/ocr';
import Spinner from 'react-native-loading-spinner-overlay';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    spinner: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = async () => {
    if (this.camera) {
      this.setState({ spinner: true });
      // Configuração da câmera
      const options = { quality: 1.0, base64: true };
      const data = await this.camera.takePictureAsync(options);
      const text = await handleUpload(data);
      Alert.alert("Texto Extraído", text.data.trim());
      // Após processar a foto desativa o spinner e mostra o resultado 
      this.setState({ spinner: false });
    }
  };


  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Processando Imagem... 😉'}
            textStyle={{ color: '#FFF' }}
          /> 
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => {this.camera = ref;}}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
            </View>
            <View style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "center"
              }}>
              <TouchableOpacity onPress={this.takePicture} style={{ alignSelf: 'center' }}>
                <Ionicons name="ios-radio-button-on" size={70} color="white" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}