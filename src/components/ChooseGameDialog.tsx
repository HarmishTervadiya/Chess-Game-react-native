import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import HorizontalButton from './HorizontalCard'
import InputBox from './InputBox'
import { DBServiceContext, Game } from '../backend/Firebase/dbService'
import { FirebaseAuthContext } from '../backend/Firebase/service'
import Snackbar from 'react-native-snackbar'

type ChoosGameGialogProps=PropsWithChildren<{
    isVisible:boolean,
    onGameSelected:(id:string|undefined)=>void
    onDismiss:()=>void
}>

const ChooseGameDialog = ({isVisible,onGameSelected,onDismiss}:ChoosGameGialogProps) => {
    let gameId='';
    const {database} =useContext(DBServiceContext)
    const {auth} =useContext(FirebaseAuthContext)
    const [game,setGame]=useState<Game|undefined>(database.game)

    const getCurrentGameState=async()=>{
        await database.getGameState(game?.gameUid!)
        .then(res=>{
            if(res?.gameUid){
            setGame(res)
            if(game?.player2?.uid){
                onGameSelected(database.game?.gameUid)
                onDismiss()
                setGame(undefined)
            }
            }})
        .catch(e=>{
            console.log(e)
            setGame(database.game)
        })
    }

    useEffect(()=>{
        if(game?.gameUid){
            if(game.player2?.uid){
                console.log('reached')
                onGameSelected(database.game?.gameUid)
                onDismiss()
                setGame(undefined)
            }else{
                getCurrentGameState()
            }
        }else{
            setGame(game)
        }
    },[game,database.playersConnected])

    const startGame=async ()=>{
        const newGame=await database.startNewGame({
            uid: auth.user!.uid,
            name:auth.user!.displayName!,
            color:'white'
        })

        if(newGame?.gameUid){
            // onGameSelected(newGame.gameUid)
            setGame(newGame)
        }
    }

    const joinRandomGame=async ()=>{
        await database.joinRandomGame({
            uid: auth.user!.uid,
            name:auth.user!.displayName!,
            color:'white'
        })
        .then(res=>{
            if(res?.gameUid){
                setGame(res)
            }
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const joinUsingCode=async()=>{
        console.log(gameId)
        if(gameId.length===6){
            await database.joinGame({
                uid: auth.user!.uid,
                name:auth.user!.displayName!,
                color:'white'
            },gameId)
            .then(res=>{
                if(res?.gameUid){
                    setGame(res)
                }
            })
            .catch(e=>{
                console.log(e)
            })
        }else{
            Snackbar.show({
                text:"Please enter a valid code",
                textColor:'red',
                duration:Snackbar.LENGTH_SHORT
            })
        }
    }

  return (
    <Modal 
        visible={isVisible}
        transparent={true}
        animationType='none'
        onDismiss={()=>onDismiss()}
      >

        <View style={[styles.modalCenteredView]} >
        <Pressable style={{ flex:1,alignItems:'center',justifyContent:'center' }} onPress={onDismiss}>
            <View style={styles.wrapper}>
                <Pressable style={[styles.cardButton]} onPress={startGame}>
                    <Text style={styles.buttonText}>Start A New Game</Text>
                </Pressable>
                {game?.gameUid && (
                <Pressable style={[styles.cardButton, {backgroundColor:'#cecece0',borderColor:'#000000',borderWidth:1,marginTop:5,}]} >
                    <Text style={[styles.buttonText,{color:'#000',fontSize:18}]}>{game.gameUid}</Text>
                </Pressable>
                )}
                <Text style={{ alignSelf:'center',fontWeight:'bold', padding:8 }}>OR</Text>

                <Pressable style={[styles.cardButton]} onPress={joinRandomGame}>
                    <Text style={styles.buttonText}>Join Random Game</Text>
                </Pressable>

                <InputBox label='Join Using Game Code' error='' changeText={(text:string)=> {
                    gameId=text
                    return text
                }} />
                
                <Pressable style={[styles.cardButton,{marginTop:5}]} onPress={joinUsingCode}>
                    <Text style={styles.buttonText}>Join</Text>
                </Pressable>
                
            </View>
        </Pressable>
        </View>
      </Modal>
  )
}

export default ChooseGameDialog

const styles = StyleSheet.create({
    modalCenteredView: {
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      wrapper:{
        backgroundColor:'#ffffff',
        padding:20,
        borderRadius:8
      },
      cardButton:{
        backgroundColor:'#6273c9',
        padding:15,
        borderRadius:8,
        alignItems:'center'
      },
      buttonText:{
        color:'#fff',
        fontWeight:'bold'
      }
})