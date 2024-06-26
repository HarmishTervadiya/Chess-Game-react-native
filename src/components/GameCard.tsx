import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { PropsWithChildren, useEffect, useRef } from 'react'

type GameCardProps = PropsWithChildren<{
    text:string,
    image:ImageSourcePropType
    onPress: ()=>void
}>

const GameCard = ({text,image,onPress}:GameCardProps) => {
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
    <Animated.View style={[
        styles.card,
        { opacity:fadeAnim }
        ]} >
        <Pressable onPress={onPress}>
            <Image source={image} style={styles.cardImage} />
        </Pressable>
        <Text style={styles.cardText}>{text}</Text>
    </Animated.View>
  )
}

export default GameCard

const styles = StyleSheet.create({
    card:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    cardImage:{
        width:130,
        height:120,
        borderRadius:15,
    },
    cardText:{
        fontSize:22,
        color:'white',
        fontWeight:"500",
        padding:10
    }
})