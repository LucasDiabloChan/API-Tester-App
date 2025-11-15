import axios from 'axios';

export interface Usuario {
  id: number;
  email: string;
}

export const getUsuarios = async (): Promise<Usuario> => {
  const response = await axios.get('https://harppia-endpoints.onrender.com/v1/users/find?key=rafaelcosta@yahoo.com');
  return response.data;
};


// PARA USAR ESSA REQUISIÇÃO, COPIE E COLE O CÓDGIO A SEGUIR NO `App.tsx`:
// Obs: faça os imports corretamente, como precisar.

// export const App = (): ReactElement => {
//   const [user, setUser] = useState<Usuario>();
//   const [log, setLog] = useState<string[]>([]);

//   const addLog = (msg: string) => setLog(prev => [...prev, msg]);

//   const runTest = async () => {
//     addLog('Executando get: usuário...');
//     try {
//       const lista = await getUsuarios();
//       setUser(lista);
//       addLog(`Sucesso: encontrado.`);
//     } catch (error) {
//       addLog(`Erro: ${error}`);
//     }
//   };

//   useEffect(() => {
//     runTest();
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <ScrollView>
//           {log.map((entry, i) => (
//             <Text key={i} style={styles.logText}>{entry}</Text>
//           ))}
//           {((
//             <View key={(user != null) ? user.id : null} style={styles.songItem}>
//               <Text style={styles.songTitle}>{(user != null) ? user.email : null}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   logText: { fontFamily: 'monospace', marginBottom: 8 },
//   songItem: { marginBottom: 12 },
//   songTitle: { fontWeight: 'bold', fontSize: 16 },
//   album: { fontStyle: 'italic', color: '#555' }
// });