import { VStack, Heading, Icon, useTheme} from 'native-base'
import {Envelope, Key} from 'phosphor-react-native'
import { useState } from 'react'
import { Alert } from 'react-native'
import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import auth from '@react-native-firebase/auth'

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {colors} = useTheme()

    function handleSignIn() {
        if(!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha.');
        }

        setIsLoading(true);

        auth().signInWithEmailAndPassword(email, password)
        .then(response => {
            console.log(response)
        })
        .catch((err) => {
            console.log(err);
            setIsLoading(false);

            if(err.code === 'auth/invalid-email') {
                return Alert.alert('Entrar', 'E-mail inválido.')
            }
            if(err.code === 'auth/user-not-found') {
                return Alert.alert('Entrar', 'Usuário não cadastrado.')
            }
            // if(err.code === 'auth/wrong-password') {
            //     return Alert.alert('Entrar', 'Usuário ou senha inválido(s)')
            // }

            return (Alert.alert('Entrar', 'Não foi possível acessar.: ' + String(err) ))

        })
    }

    return (
        <VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24}>
            <Logo></Logo>
            <Heading color='gray.100' fontSize='xl' mt={20} mb={6}>Acesse sua conta</Heading>

            <Input 
                placeholder='E-mail' 
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]}/>} ml={4}/>}
                onChangeText={text => setEmail(text)}
            />
            <Input 
                placeholder='Senha'
                InputLeftElement={<Icon as={<Key color={colors.gray[300]}/>} ml={4}/>}
                secureTextEntry
                mb={8}
                onChangeText={text => setPassword(text)}
            ></Input>

            <Button title='Entrar' w='full' onPress={handleSignIn}
                isLoading={isLoading}
            ></Button>
        </VStack>
    )
}