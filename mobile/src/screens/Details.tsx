import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PollCardProps } from "../components/PollCard";
import { PoolHeader } from "../components/PollHeader";
import { api } from "../services/api";

interface RouteParams {
  pollId: string;
}

export const Details = () => {
  const toast = useToast();
  const route = useRoute();
  const { pollId } = route.params as RouteParams;

  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<PollCardProps>({} as PollCardProps);
  const [selectedOption, setSelectedOption] = useState<"guesses" | "ranking">(
    "guesses"
  );

  const fetchPollDetails = async () => {
    if (!pollId) {
      toast.show({
        title: "Ops!",
        description: "Não foi possível carregar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
      return;
    }

    try {
      setIsLoading(true);
      const pollsResponse = await api.get(`polls/${pollId}`);
      setPoll(pollsResponse.data.poll);
    } catch (error: any) {
      toast.show({
        title: "Ops!",
        description: "Não foi possível carregar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareCode = async () => {
    await Share.share({
      message: `Olá, venha participar do meu bolão no Bolão da Copa! Use o código ${poll.code} para entrar.`,
    });
  };

  useEffect(() => {
    fetchPollDetails();
  }, [pollId]);

  return (
    <VStack flex={1} bg="gray.900">
      <Header
        title={isLoading ? "" : poll.title}
        onShare={shareCode}
        showBackButton
        showShareButton
      />
      {isLoading ? (
        <Loading />
      ) : poll._count?.participants <= 0 ? (
        <EmptyMyPoolList code={poll.code} onShare={shareCode} />
      ) : (
        <VStack px={5} flex={1}>
          <PoolHeader data={poll} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={selectedOption === "guesses"}
              onPress={() => setSelectedOption("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={selectedOption === "ranking"}
              onPress={() => setSelectedOption("ranking")}
            />
          </HStack>

          <Guesses pollId={pollId} code={poll.code} onShare={shareCode} />
        </VStack>
      )}
    </VStack>
  );
};
