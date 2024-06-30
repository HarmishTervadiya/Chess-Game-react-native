import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from '../screens/Home'
import PlayLocal from '../screens/PlayLocal'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'
import { NavigationContainer } from '@react-navigation/native'
import { FirebaseAuthContext } from '../backend/Firebase/service'
import PlayOnline from '../screens/PlayOnline'

export type RootStackParamList={
    Home:undefined,
    Login:undefined,
    SignUp:undefined,
    LocalGame:undefined,
    OnlineGame: {id:string},
} 

const Stack=createNativeStackNavigator<RootStackParamList>()

const Router = () => {
  const {auth}=useContext(FirebaseAuthContext)
    
  return (
    
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
            name='Home'
            component={Home}
            options={{ 
                title:"Home",
                headerShown:false
             }}
        />

        <Stack.Screen
            name='LocalGame'
            component={PlayLocal}
            options={{ 
                title:'Local Game',
                headerShown:false
             }}
        />    


        <Stack.Screen
            name='OnlineGame'
            component={PlayOnline}
            options={{ 
                title:'Online Game',
                headerShown:false
             }}
        />    
        
        <Stack.Screen
            name='Login'
            component={Login}
            options={{ 
                title:'Login',
                headerShown:false
             }}
        />

        <Stack.Screen
            name='SignUp'
            component={SignUp}
            options={{ 
                title:'SignUp',
                headerShown:false

             }}
        />    

    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router
