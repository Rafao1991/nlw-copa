import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import Logo from "../assets/logo.svg";
import { api } from "../services/api";

export const New = () => {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePollCreation = async () => {
    if (!title.trim()) {
      return toast.show({
        title: "Ops!",
        description: "Preencha o nome do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);
      await api.post("polls/", {
        title,
      });

      toast.show({
        title: "Sucesso!",
        description: "Bolão criado com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      setTitle("");
    } catch (error) {
      toast.show({
        title: "Ops!",
        description: "Não foi possível criar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Criar novo bolão" onShare={() => {}}></Header>
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa{"\n"}e compartilhe entre amigos!
        </Heading>
        <Input
          mb={2}
          placeholder="Qual nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />
        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePollCreation}
          isLoading={isLoading}
        ></Button>
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
};
