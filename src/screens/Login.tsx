import { StyleSheet, Text, View, ScrollView, Button, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import BattleOfMinds from '../assets/BattleOfMinds.png';

import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import LinearGradient from 'react-native-linear-gradient'

// Form Validation
import { Formik } from 'formik';

import * as Yup from 'yup';
import InputBox from '../components/InputBox'
 
const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

// Responsive
import { Dimensions} from 'react-native'
const Width=Dimensions.get('window').width

//Auth
import { FirebaseAuthContext, userSignIn } from '../backend/Firebase/service';


type LoginProps =  NativeStackScreenProps<RootStackParamList,'Login'>

const Login = ({navigation}:LoginProps) => {

  const [screenWidth,setScreenWidth]=useState(Width)

  useEffect(()=>{
    Dimensions.addEventListener('change', ({window:{width,height}})=>{
        setScreenWidth(width)
    })
  })

  const {auth}=useContext(FirebaseAuthContext)
  const loginUser=async ({email,password}:userSignIn)=>{
    const res=await auth.signInUser({email,password})
      if(res){
        navigation.navigate('Home')
      }
  }

  return (  
      <LinearGradient
      useAngle={true}
      angle={65}
      colors={['#4246b4', '#141E30']}
      style={styles.container}
      >
      <ScrollView contentContainerStyle={screenWidth.toFixed() > '560' && { flexDirection:'row' } } scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <Image source={BattleOfMinds} style={{ width:300, maxHeight:230,height:230, alignSelf:'center' }} />
        
        <Formik
        initialValues={{
          email: '',
          password:'',
        }}
        validationSchema={SignupSchema}
        onSubmit={values => {
          loginUser(values)
        }}
        >

      {({ values,
         errors,
         touched,
         isValid,
         handleChange,
         handleSubmit,
         handleReset }) => (
          <View
          style={{ alignSelf:'center',backgroundColor:'#fff',padding:20, borderRadius:8,marginTop:10 }}
          >

          <Text style={styles.headingText}>Login to your account</Text>

            <InputBox label='Email' 
            error={errors.email}
            changeText={(text:string)=> values.email=text} />
            
            
            <InputBox label='Password' 
            error={errors.password}
            changeText={(text:string)=> values.password=text} />
            
            <View style={styles.submitContainer}>
              <Pressable style={styles.submitButton} onPress={()=>handleSubmit()}>
                <Text style={styles.submitText}>Login</Text>
              </Pressable>
              <Text 
              style={styles.registerText}
              onPress={()=>navigation.navigate('SignUp')}> Create Account </Text>
            </View>
          </View>
       )}
      </Formik>

      </ScrollView>
    </LinearGradient>
    
  )
}

export default Login

const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  submitContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:10
  },
  submitButton:{
    backgroundColor:'#10b4fa',
    padding:12,
    borderRadius:8
  },
  submitText:{
    fontSize:16,
    color:'#fff',
    fontWeight:'bold'
  },
  registerText:{
    fontSize:16,
    color:'#000',
    fontWeight:'bold',
    textDecorationColor:'#000',
    textDecorationStyle:'solid'
  },
  headingText:{
    fontSize:22,
    color:'#000',
    fontWeight:'bold',
    marginVertical:10
  }
})