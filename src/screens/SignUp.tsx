import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Formik } from 'formik';
import BattleOfMinds from '../assets/BattleOfMinds.png';
import * as Yup from 'yup';
import InputBox from '../components/InputBox'
import { Dimensions} from 'react-native'
import { FirebaseAuthContext, userSignIn, userSignUp } from '../backend/Firebase/service';
 

// Navigation
import { RootStackParamList } from '../router/router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

// Form Validation
const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6,'Password must be minimum of 6 characters '),
  name: Yup.string().required('Name is required'),
});

// Responsive
const Width=Dimensions.get('window').width

type SignUpProps =  NativeStackScreenProps<RootStackParamList,'SignUp'>

const SignUp = ({navigation}:SignUpProps) => {

  const [screenWidth,setScreenWidth]=useState(Width)

  useEffect(()=>{
    Dimensions.addEventListener('change', ({window:{width,height}})=>{
        setScreenWidth(width)
    })
  })

  const {auth}=useContext(FirebaseAuthContext)

  const registerUser=async ({name,email,password}:userSignUp)=>{
      const res=await auth.createAccount({name,email,password})
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
      
      <KeyboardAvoidingView>
      <Image source={BattleOfMinds} style={{ width:300, maxHeight:230,height:230, alignSelf:'center' }} />
      
      <Formik
      initialValues={{
        email: '',
        password:'',
        name:'',
      }}
      validationSchema={SignupSchema}
      onSubmit={values => {
        registerUser(values)
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
        style={{ alignSelf:'center',backgroundColor:'#fff',padding:20, borderRadius:8,marginVertical:10 }}
        >

        <Text style={styles.headingText}>Create a new account</Text>


          <InputBox label='Name' 
          error={errors.name}
          changeText={(text:string)=> values.name=text} />


          <InputBox label='Email' 
          error={errors.email}
          changeText={(text:string)=> values.email=text} />
          
          
          <InputBox label='Password' 
          error={errors.password}
          changeText={(text:string)=> values.password=text} />
          
          <View style={styles.submitContainer}>
            <Pressable style={styles.submitButton} onPress={()=>handleSubmit()}>
              <Text style={styles.submitText}>Sign Up</Text>
            </Pressable>
            <Text 
            style={styles.registerText}
            onPress={()=>navigation.navigate('Login')}>Already have a account ? </Text>
          </View>
        </View>
     )}
    </Formik>
    </KeyboardAvoidingView>
    </ScrollView>
  </LinearGradient>
  
  )
}

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
    padding:10
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

export default SignUp

