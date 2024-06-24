import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type LoginProps =  NativeStackScreenProps<RootStackParamList,'Login'>

const Login = ({navigation}:LoginProps) => {
  return (
    <View>
      <Text onPress={()=>navigation.navigate('Home')}>Login</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})