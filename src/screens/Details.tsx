import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack,  ScrollView, Text, useTheme, VStack, Box } from 'native-base';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDataFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Clipboard, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const {colors} = useTheme()

  const navigation = useNavigation()

  function handleOrderClose() {
    if(!solution) {
      return Alert.alert('Solitação', 'Informe a solução para encerrar a solicitação')
    }

    firestore().collection<OrderFirestoreDTO>('orders').doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação encerrada')
      navigation.goBack()
    })
    .catch( err => {
      console.log(err)
      Alert.alert('Solicitação', 'Não  foi possível encerrar a solicitação' + err)
    })
  }

  useEffect(() => {
    firestore().collection<OrderFirestoreDTO>('orders').doc(orderId).get()
    .then(doc => {
      const {patrimônio, description, status, created_at, closed_at, solution} = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimônio,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      })

      setIsLoading(false);
    })
  }, [])

  const route = useRoute();
  const {orderId} = route.params as RouteParams;

  if(isLoading) { return <Loading></Loading>}

  return (
    <VStack flex={1} bg='gray.700'>
        <Header title='Solicitação'></Header>
        <HStack bg='gray.500' justifyContent='center' p={4}>
          {order.status === 'closed' ? 
            <CircleWavyCheck size={22} color={colors.green[300]}></CircleWavyCheck>
          :
            <Hourglass size={22} color={colors.secondary[700]}></Hourglass>
          }
          <Text
            fontSize={12}
            color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform='uppercase'
          >
            {order.status === 'closed' ? 'finalizado' : 'em andamento'}
          </Text>
        </HStack>

        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
            <CardDetails
              title='equipamento'
              description={`Patrimônio ${order.patrimônio}`}
              icon={DesktopTower}
            ></CardDetails>
            <CardDetails
              title='descrição do problema'
              description={order.description}
              icon={ClipboardText}
              footer={`Registardo em ${order.when}`}
            ></CardDetails>
            <CardDetails
              title='solução'
              icon={CircleWavyCheck}
              description={order.solution}
              footer={order.closed && `Encerrado em ${order.closed}`}
            >
              {
              order.status === 'open' &&
                <Input 
                  placeholder='Descrição da solução'
                  onChangeText={setSolution}
                  textAlignVertical='top'
                  multiline
                  h={24}
                ></Input>
              }
            </CardDetails>
        </ScrollView>
          {
            order.status === 'open' && <Button onPress={handleOrderClose} title='Encerrar solicitação' m={5}></Button>
          }

    </VStack>
  );
}