import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type SignUpProps =  NativeStackScreenProps<RootStackParamList,'SignUp'>

const SignUp = ({navigation}:SignUpProps) => {
  return (
    <View>
      <Text onPress={()=>navigation.navigate('Login')}>SignUp</Text>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({})