import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native'
export function EmptyHabits(){
  
  const {navigate} = useNavigation()
  return(
    <Text className='text-zinc-400 text-base'>
      Você ainda não criou nenhum hábito{' '}
      <Text 
        className='text-violet-400 text-base underline active:text-violet-500'
        onPress={() => navigate('new')}
      >
        Clique aqui para cadastrar um novo hábito
      </Text>
    </Text>
  )
}