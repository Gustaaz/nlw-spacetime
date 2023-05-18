import { useEffect } from 'react'
import { styled } from 'nativewind'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import bluerBg from '../src/assets/bg-bluer.png'
import Stripes from '../src/assets/stripes.svg'
import NLWLogo from '../src/assets/nlw-logo.svg'
import { api } from '../src/lib/api'

const StyleStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/dad3132bb93d058da85e',
}

export default function App() {
  const router = useRouter()

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  // eslint-disable-next-line no-unused-vars
  const [_, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'dad3132bb93d058da85e',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubSignIn(code: string) {
    const response = await api.post('/register', { code })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      handleGithubSignIn(code)
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={bluerBg}
      className="relative flex-1 items-center bg-zinc-900 px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyleStripes className="absolute left-2" />
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
