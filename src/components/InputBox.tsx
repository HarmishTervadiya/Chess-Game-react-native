import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { PropsWithChildren } from 'react'

type InputBoxProps = PropsWithChildren<{
    label:string,
    error:string | undefined,
    changeText: (text:string)=> string
}>


const InputBox = ({label,error,changeText}:InputBoxProps) => {
  return (
    <View>
        <Text style={styles.labelText}>{label}</Text>
        <View style={styles.inputBox}>
            <TextInput 
            style={styles.input}
            onChangeText={changeText}
            secureTextEntry={label==='Password'? true : false }
            enablesReturnKeyAutomatically={true}
            returnKeyType='next'
            key={label}
            />
        </View >

        
        {error && (
            <Text style={styles.errText}>{error}</Text>
        )}
    </View>
  )
}

export default InputBox

const styles = StyleSheet.create({
    inputBox:{
        width:330,
        backgroundColor:'#fff',
        borderRadius:8,
        elevation:2,
        shadowOffset:{
            width:1,
            height:1
        },
        shadowColor:'#000',
        shadowRadius:8,
        borderWidth:1
    },
    input:{
        paddingHorizontal:15
    },
    labelText:{
        color:'#000',
        fontSize:16,
        padding:5
    },
    errText:{
        color:'#ff0000',
        fontSize:16,
        padding:5
    }
})