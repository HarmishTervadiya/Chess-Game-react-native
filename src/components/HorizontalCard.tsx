import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { PropsWithChildren, useEffect, useRef } from 'react'

type HorizontalButtonProps = PropsWithChildren<{
    text:string,
    imageUri?:string
    onPress: ()=>void
}>

const HorizontalButton = ({text,imageUri,onPress}:HorizontalButtonProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

    useEffect(()=>{
        fadeIn()
    })

  return (
    <TouchableOpacity onPress={onPress}>
       
        <Animated.View style={[
            styles.card,
            { opacity:fadeAnim }
            ]} >
                {imageUri && (<Image source={{ 
                    uri:imageUri
                }} style={styles.cardImage} />)}
                
            <Text style={styles.cardText}>{text}</Text>
        </Animated.View>
    </TouchableOpacity>
  )
}

export default HorizontalButton

const styles = StyleSheet.create({
    card:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        borderRadius:8,
        marginVertical:15,
        width:300,
        alignSelf:'center'

    },
    cardImage:{
        width:30,
        height:30,
        borderRadius:15,
        alignSelf:'flex-start'
    },
    cardText:{
        fontSize:22,
        color:'#000',
        fontWeight:"500",
        padding:10
    }
})