import React, { ReactElement, useState } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postUsuario, UsuarioCadastroDTO } from './api_reqs_example/sch_usuario/PostUser';

console.log('App.tsx iniciou');

export const App = (): ReactElement => {
  const [cpf, setCpf] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeSocialCompleto, setNomeSocialCompleto] = useState('');
  const [sexo, setSexo] = useState(''); // 'M' ou 'F'
  const [dataNascimento, setDataNascimento] = useState(''); // YYYY-MM-DD
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');

  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Função para adicionar logs de forma eficiente e visível no app
  const addLog = (msg: string) => {
    console.log(msg); // Também manda para o console de debug
    setLogs(prev => [...prev, msg]);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      addLog('Permissão para acessar fotos negada');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      base64: false
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0]);
      addLog('Imagem selecionada: ' + result.assets[0].uri);
      console.log(JSON.stringify(result, null, 2));
    }
  };

  const handleRegister = async () => {
    if (!cpf || !nomeCompleto || !sexo || !dataNascimento || !email || !telefone || !senha ||
        !cep || !uf || !cidade || !bairro || !logradouro || !numero) {
      addLog('Erro: Preencha todos os campos obrigatórios.');
      return;
    }

    const userData: UsuarioCadastroDTO = {
      cpf,
      nomeCompleto,
      nomeSocialCompleto,
      sexo: sexo.charAt(0),
      dataNascimento,
      email,
      telefone,
      senha,
      endereco: {
        cep,
        uf,
        cidade,
        bairro,
        logradouro,
        numero,
        complemento,
      },
    };

    try {
      setLoading(true);
      addLog('Iniciando cadastro...');
      const response = await postUsuario(userData, profilePhoto ? {
        uri: profilePhoto.uri,
        type: profilePhoto.type || 'image/jpeg',
        name: profilePhoto.fileName || `photo.${Platform.OS === 'ios' ? 'jpg' : 'jpeg'}`
      } : undefined);

      addLog('Usuário cadastrado com ID: ' + response.id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      addLog('Falha no cadastro: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Cadastro de Usuário</Text>

          <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
          <TextInput style={styles.input} placeholder="Nome Completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
          <TextInput style={styles.input} placeholder="Nome Social (opcional)" value={nomeSocialCompleto} onChangeText={setNomeSocialCompleto} />
          <TextInput style={styles.input} placeholder="Sexo (M/F)" value={sexo} onChangeText={setSexo} maxLength={1} />
          <TextInput style={styles.input} placeholder="Data de Nascimento (YYYY-MM-DD)" value={dataNascimento} onChangeText={setDataNascimento} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

          <Text style={styles.subtitle}>Endereço</Text>
          <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="UF" value={uf} onChangeText={setUf} />
          <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
          <TextInput style={styles.input} placeholder="Logradouro" value={logradouro} onChangeText={setLogradouro} />
          <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Complemento (opcional)" value={complemento} onChangeText={setComplemento} />

          <Button title="Selecionar Foto" onPress={pickImage} />
          {profilePhoto && <Text style={{ marginVertical: 8 }}>Foto selecionada!</Text>}

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button title="Cadastrar" onPress={handleRegister} />
          )}

          <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Logs:</Text>
          <ScrollView style={{ maxHeight: 150, borderWidth: 1, borderColor: '#ccc', padding: 8 }}>
            {logs.map((log, index) => (
              <Text key={index} style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 4 }}>
                {log}
              </Text>
            ))}
          </ScrollView>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
