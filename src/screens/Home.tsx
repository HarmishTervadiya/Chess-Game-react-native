import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import BattleOfMinds from '../assets/BattleOfMinds.png';
import GameOffineImage from '../assets/GameOffline.png';
import GameOnlineImage from '../assets/GameOnline.jpeg';


import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import LinearGradient from 'react-native-linear-gradient'
import GameCard from '../components/GameCard';
import HorizontalButton from '../components/HorizontalCard';
import FirebaseAuthService, { FirebaseAuthContext } from '../backend/Firebase/service';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

// Responsive
import { Dimensions} from 'react-native'
import { DBServiceContext } from '../backend/Firebase/dbService';
import ChooseGameDialog from '../components/ChooseGameDialog';
const Width=Dimensions.get('window').width

type HomeProps =  NativeStackScreenProps<RootStackParamList,'Home'>

const Home = ({navigation}:HomeProps) => {

  const [screenWidth,setScreenWidth]=useState(Width)

  const firebase=useContext(FirebaseAuthContext)

  const {database}=useContext(DBServiceContext)
  const [gameId,setGameId]=useState(database.game?.gameUid)
  const [isVisible,setIsVisible]=useState(false)

  useEffect(()=>{
    console.log(`GameId :: ${gameId}`)
    if(database.playersConnected){
        navigation.navigate('OnlineGame',{id:gameId!})
    }
  },[gameId])

  const [isLoggedIn,setIsLoggedIn]=useState(firebase.auth.user!==null)
  const logout=async ()=>{
    await firebase.auth.logoutUser()
    setIsLoggedIn(false)
  }

  // Handle user state changes
  function onAuthStateChanged(user:FirebaseAuthTypes.User|null) {
    setIsLoggedIn(user!==null)
  }

  // Animation 
  const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };


  useEffect(()=>{
    auth().onAuthStateChanged((user)=>onAuthStateChanged(user))
    fadeIn()
    Dimensions.addEventListener('change', ({window:{width,height}})=>{
      setScreenWidth(width)
  })
  },[])

  return (
    <LinearGradient
      useAngle={true}
      angle={65}
      colors={['#4246b4', '#141E30']}
      style={styles.container}
      >
      <ScrollView contentContainerStyle={ screenWidth.toFixed() > '560' && {flex:1, flexDirection:'row' } } scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <Animated.Image source={BattleOfMinds} style={{ width:300, maxHeight:300,height:300, alignSelf:'center', opacity:fadeAnim }} />

        <View style={screenWidth.toFixed() > '560' && {height:'100%', justifyContent:'center',alignSelf:'center' }}>
        <View style={styles.cardContainer}>
          <GameCard image={GameOffineImage} text='Play Local' onPress={()=>navigation.navigate('LocalGame')} />
          <GameCard image={GameOnlineImage} text='Play Online' onPress={()=>{
            {isLoggedIn ? setIsVisible(true) : 
            navigation.navigate('Login')
          }}} />
        </View>

        {isLoggedIn ? (
          <HorizontalButton text='Logout' onPress={()=>{logout()}} />
        ):(
          <HorizontalButton text='Login' onPress={()=>navigation.navigate('Login')} />
        )}

        </View>

        <ChooseGameDialog onDismiss={()=>setIsVisible(false)} onGameSelected={setGameId} isVisible={isVisible} />
      </ScrollView>
    </LinearGradient>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100%',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  cardContainer:{
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center',
    width:'100%',
    // height:130
  }
})