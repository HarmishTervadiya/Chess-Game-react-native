import { StyleSheet, Text, View } from 'react-native'
import React from 'react'



import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type HomeProps =  NativeStackScreenProps<RootStackParamList,'Home'>

const Home = ({navigation}:HomeProps) => {
  return (
    <View>
      <Text onPress={()=>navigation.navigate('SignUp')}>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})