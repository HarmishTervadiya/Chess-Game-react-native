import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import { createContext } from 'react'
import Snackbar from 'react-native-snackbar'

export type userSignIn={
    email:string,
    password:string
}

export type userSignUp={
    name:string
    email:string
    password:string
}


class FirebaseAuthService{
    user;

    constructor(){
        this.user=auth().currentUser
    }


    async createAccount({name,email,password}:userSignUp) {
        try {
             await auth().createUserWithEmailAndPassword(email,password)
            .then(res=>{
                if(res){
                    res.user.updateProfile({
                        displayName:name
                    }).catch(e=>console.log(e))
                }
                this.user=res.user
            }).catch(e=>{
                let error='Something went wrong'
                if(String(e).search('auth/email-already-in-use')){
                    error='Email address is already in use'
                }

                Snackbar.show({
                    text:`${error}` ,
                    duration:Snackbar.LENGTH_LONG
                })                

            console.log('SERVICE :: signOutUser :: '+e)
            })
        } catch (err) {
            Snackbar.show({
                text:`${err}` ,
                duration:Snackbar.LENGTH_LONG
            })            
            console.log('SERVICE :: signOutUser exception :: '+err)
        }
        return this.user
    }

    async signInUser({email,password}:userSignIn){
        try {
            await auth().signInWithEmailAndPassword(email,password)
            .then(res=>{
                if(res){
                    this.user=res.user
                }
            }).catch(err=>{
                let error='Something went wrong'
                if(String(err).search('auth/invalid-credential')){
                    error='Invalid email or password'
                }
                Snackbar.show({
                    text:`${error}` ,
                    duration:Snackbar.LENGTH_LONG
                })         
            console.log('SERVICE :: signInUser :: '+err)
            })
        } catch (err) {
            Snackbar.show({
                text:`${err}` ,
                duration:Snackbar.LENGTH_LONG
            })            
            console.log('SERVICE :: signInUser exception :: '+err)
        }

        return this.user
    }

    async logoutUser(){
        try {
            return await auth().signOut()
            .then(()=>{
                Snackbar.show({
                    text:`Logout Successfully` ,
                    duration:Snackbar.LENGTH_LONG
                })
                this.user=null
                }   
            ).catch(err=>{
                Snackbar.show({
                    text:`${err}` ,
                    duration:Snackbar.LENGTH_LONG
                })         
            console.log('SERVICE :: logoutUser :: '+err)

            })
        } catch (err) {
            Snackbar.show({
                text:`${err}` ,
                duration:Snackbar.LENGTH_LONG
            })            

            console.log('SERVICE :: logoutUser exception :: '+err)
        }
    }

    async getCurrentUser(){
        try {
            return this.user
        } catch (error) {
            console.log('SERVICE :: getCurrentUser :: '+error)
        }
    }
}

type AuthContext={
    auth:FirebaseAuthService,
}

export const FirebaseAuthContext=createContext<AuthContext>({
    auth: new FirebaseAuthService()
})

export default FirebaseAuthService