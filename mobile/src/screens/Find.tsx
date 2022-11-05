import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export const Find = () => {
  const toast = useToast();
  const { navigate } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleJoinPoll = async () => {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Ops!",
          description: "Preencha o código do bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`polls/${code}/join`);

      toast.show({
        title: "Sucesso!",
        description: "Você entrou no bolão com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("polls");
    } catch (error: any) {
      setIsLoading(false);

      if (error?.response?.data?.message) {
        return toast.show({
          title: "Ops!",
          description: error.response.data.message,
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Ops!",
        description: "Não foi possível entrar no bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de{"\n"}seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"
        />
        <Button title="BUSCAR BOLÃO" onPress={handleJoinPoll}></Button>
      </VStack>
    </VStack>
  );
};
