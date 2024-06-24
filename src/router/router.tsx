import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from '../screens/Home'
import PlayLocal from '../screens/PlayLocal'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'
import { NavigationContainer } from '@react-navigation/native'

export type RootStackParamList={
    Home:undefined,
    Login:undefined,
    SignUp:undefined,
    LocalGame:undefined
} 

const Stack=createNativeStackNavigator<RootStackParamList>()

const Router = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='LocalGame'>
        <Stack.Screen
            name='Home'
            component={Home}
            options={{ 
                title:'Home'
             }}
        />

        <Stack.Screen
            name='LocalGame'
            component={PlayLocal}
            options={{ 
                title:'Local Game'
             }}
        />    

        <Stack.Screen
            name='Login'
            component={Login}
            options={{ 
                title:'Login'
             }}
        />

        <Stack.Screen
            name='SignUp'
            component={SignUp}
            options={{ 
                title:'SignUp'
             }}
        />    

    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router
