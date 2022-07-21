import { VStack } from 'native-base';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';


export function Register() {

  const [isLoading, setIsLoading] = useState(false)
  const [patrimônio, setPatrimônio] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleNewOrder() {
    if(!patrimônio || !description) {
      Alert.alert('Registrar', 'Preencha todos campos')
    }

    setIsLoading(true);

    firestore().collection('orders').add({
      patrimônio, 
      description, 
      status: 'open', 
      created_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação registrada com sucesso.')
      navigation.goBack()
    })
    .catch((error) => {
      console.log(error);
      setIsLoading(false);
      return Alert.alert('Solicitação', 'Não foi possível registrar o pedido' + error)
    })


  }

  return (
    <VStack flex={1} p={6} bg='gray.600'>
        <Header title='Nova solicitação'></Header>
        <Input placeholder='Número do patrimônio' mt={4} onChangeText={setPatrimônio}></Input>
        <Input placeholder='Descrição do problema' mt={5} flex={1} multiline 
        textAlignVertical='top' onChangeText={setDescription}></Input>
        <Button title='Cadastrar' mt={5}
          isLoading={isLoading}
          onPress={handleNewOrder}
        ></Button>
    </VStack>
  );
}