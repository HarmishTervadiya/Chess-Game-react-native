import database from '@react-native-firebase/database';
import { ChessBoardPiece } from '../../screens/PlayLocal';
import Snackbar from 'react-native-snackbar';
import { createContext } from 'react';
import { chessboard } from '../MoveValidation';

const dbRef='GameList'

type User={
    uid:string,
    name:string,
    color:string
}

export type Game={
    gameUid:string,
    player1:User,
    player2:User|null,
    gameState:ChessBoardPiece[][],
    isGameOver:string,
    isDraw?:boolean,
    turn:string,
    lostWhitePieces?:ChessBoardPiece[],
    lostBlackPieces?:ChessBoardPiece[],
}

class DBService{

    game:Game|undefined;
    playersConnected:boolean=false
    db=database

    constructor(){
            database().ref(`${dbRef}/${this.game?.gameUid}`)
            .once('value')
            .then(async snapshot=>{
                if(snapshot.val()){
                    this.playersConnected=snapshot.hasChild('player2')
                    console.log(this.playersConnected)
                }
            })
    }
    
    async startNewGame({uid,name,color}:User){
        try {
            const newGame:Game={
                gameUid:String(Math.random()).slice(2,8),
                player1:{uid,name,color},
                player2:null,
                isGameOver:'',
                isDraw:false,
                turn:'white',
                gameState:chessboard,
                lostBlackPieces:[],
                lostWhitePieces:[]
                
            }

            await database().ref(`${dbRef}/${newGame.gameUid}`)
                    .set(newGame)
                    .then(()=>{
                        this.game=newGame
                        console.log('Game Created')
                    })
                    .catch(e=>{
                        console.log("dbService :: startNewGame ::"+e)
                        Snackbar.show({
                            text:'Somehing went wrong',
                            duration:Snackbar.LENGTH_LONG
                        })
                    })

        } catch (error) {
            console.log("dbService :: startNewGame :: Exception ::"+error)
            Snackbar.show({
                text:'Somehing went wrong',
                duration:Snackbar.LENGTH_LONG
            })
        }

        return this.game
    }


    async joinGame({uid,name}:User,gameUid:string){
        try {     
            await database().ref(`${dbRef}/${gameUid}`)
                .once('value')
                .then(snapshot=>{
                    this.game=snapshot.val()
                })

            if(this.game){
                await database().ref(`${dbRef}/${gameUid}`)
                    .update({
                        player2:{
                            uid,
                            name,
                            color:'black'
                        }
                    })
                    .then(()=>{
                        let player2={
                            uid,
                            name,
                            color:'black'
                        }

                        this.game?.player2!=player2
                        this.playersConnected=true
                        console.log('Game Joined')
                    })
                    .catch(e=>{
                        console.log("dbService :: joinGame ::"+e)
                        Snackbar.show({
                            text:'Somehing went wrong',
                            duration:Snackbar.LENGTH_LONG
                        })
                    })
            }else{
                console.log("dbService :: joinGame :: Game not found")
            
                Snackbar.show({
                    text:'Game not found',
                    duration:Snackbar.LENGTH_LONG,
                    textColor:'#ff0000'
                })    
            }            
            return this.game;   
        } catch (error) {
            console.log("dbService :: joinGame :: Exception ::"+error)
            Snackbar.show({
                text:'Somehing went wrong',
                duration:Snackbar.LENGTH_LONG
            })
            return this.game;
        }

    }

    async joinRandomGame({uid,name}:User){
        let availableGames:Game;
        try {   
            await database().ref(`${dbRef}`)
                .once('value')
                .then(async snapshot=>{
                    let temp=snapshot.val()
                    for (const gameUid in temp) {
                        const gameData = temp[gameUid];
                        if (gameData.player2 === null || gameData.player2 === undefined && gameData.player1.uid !==uid) {
                          availableGames=gameData
                          break;
                        }
                      }
            
                    if(availableGames){
                        await database().ref(`${dbRef}/${availableGames.gameUid}`)
                            .update({
                                player2:{
                                    uid,
                                    name,
                                    color:'black'
                                }
                            })
                            .then(()=>{
                                availableGames.player2={
                                    uid,
                                    name,
                                    color:'black'
                                }
                            
                                this.game=availableGames
                                this.playersConnected=true
                                console.log('Game Joined')
                            })
                            .catch(e=>{
                                console.log("dbService :: joinGame ::"+e)
                                Snackbar.show({
                                    text:'Somehing went wrong',
                                    duration:Snackbar.LENGTH_LONG
                                })
                            })
                    }else{
                        console.log("dbService :: joinGame :: Game not found")
                        Snackbar.show({
                            text:'Game not found',
                            duration:Snackbar.LENGTH_LONG,
                            textColor:'#ff0000'
                        })    
                    }            

                })

                return this.game;
        } catch (error) {
            console.log("dbService :: joinGame :: Exception ::"+error)
            Snackbar.show({
                text:'Somehing went wrong',
                duration:Snackbar.LENGTH_LONG
            })

            return this.game;
        }

    }

    async getGameState(gameId: string) {
        try {
        await database().ref(`${dbRef}/${gameId}`).once('value')
        .then(snapshot=>{
          if(snapshot.val()) {
            this.game = snapshot.val();
            if(this.game?.player2?.uid){
                this.playersConnected=true
            }
          } else {
            console.log("DBService :: getGameState :: Game not found");
            Snackbar.show({
              text: 'Game not found',
              duration: Snackbar.LENGTH_LONG,
              textColor: '#ff0000'
            });

            }
        })
            return this.game;  // Indicate game not found
        } catch (error) {
          console.log("DBService :: getGameState :: Exception:", error);
          Snackbar.show({
            text: 'Something went wrong',
            duration: Snackbar.LENGTH_LONG
          });

          return this.game;  // Indicate error
        }
      }

    async updateGameState(gameState:ChessBoardPiece[][],gameId:string,turn:string){
        try {
            
            await database().ref(`${dbRef}/${gameId}/`)
                    .update({
                        gameState:gameState,
                        turn:turn
                    })
                    
            // await database().ref(`${dbRef}/${gameId}/`)
            //         .update({turn:turn})

            // gameState.forEach(row=>{
            //     row.forEach(async square=>{
            //         await database().ref(`${dbRef}/${gameId}/gameState/${square.row}/${square.column}`)
            //         .update(gameState[square.row][square.column])
            //     })
            // })

                
            this.game={
                gameUid:'',
                player1:this.game?.player1!,
                player2:this.game?.player2!,
                isDraw:this.game?.isDraw,
                isGameOver:this.game?.isGameOver!,
                turn:turn,
                gameState:gameState
            }

            return true

        } catch (error) {
            console.log("DBService :: updateGameState :: Exception:", error);
            Snackbar.show({
              text: 'Something went wrong',
              duration: Snackbar.LENGTH_LONG
            });
            return false
        }
    }

    async setWinner(gameState:ChessBoardPiece[][],gameId:string,winner:string){
        try {
            await database().ref(`${dbRef}/${gameId}/`)
                    .update({isGameOver:winner})
                           
            this.game={
                gameUid:'',
                player1:this.game?.player1!,
                player2:this.game?.player2!,
                isDraw:this.game?.isDraw,
                isGameOver:winner,
                turn:this.game?.turn!,
                gameState:gameState        
            }

            return true

        } catch (error) {
            console.log("DBService :: setWinner :: Exception:", error);
            Snackbar.show({
              text: 'Something went wrong',
              duration: Snackbar.LENGTH_LONG
            });
            return false
        }
    }

    async addLostPieces(gameState:ChessBoardPiece[][],gameId:string,whitePieces:ChessBoardPiece[],blackPieces:ChessBoardPiece[]){
        try {
            // gameState.forEach(row=>{
            //     row.forEach(async square=>{
            //         await database().ref(`${dbRef}/${gameId}/gameState/${square.row}/${square.column}`)
            //         .update(gameState[square.row][square.column])
            //     })
            // })

            await database().ref(`${dbRef}/${gameId}/`)
                    .update({
                        lostWhitePieces:whitePieces,
                        lostBlackPieces:blackPieces
                    })
                    

            this.game={
                gameUid:'',
                player1:this.game?.player1!,
                player2:this.game?.player2!,
                isDraw:this.game?.isDraw,
                isGameOver:this.game?.isGameOver!,
                turn:this.game?.turn!,
                gameState:gameState,
                lostBlackPieces:blackPieces,
                lostWhitePieces:whitePieces
            }

            return true

        } catch (error) {
            console.log("DBService :: updateGameState :: Exception:", error);
            Snackbar.show({
              text: 'Something went wrong',
              duration: Snackbar.LENGTH_LONG
            });
            return false
        }
    }

}


export const DBServiceContext = createContext({
    database: new DBService
})
