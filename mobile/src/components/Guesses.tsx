import React, { useEffect, useState } from "react";
import { Box, FlatList, useToast } from "native-base";
import { api } from "../services/api";
import { Loading } from "./Loading";
import { Match, MatchProps } from "./Match";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  pollId: string;
  code: string;
  onShare: () => void;
}

export function Guesses({ pollId, code, onShare }: Props) {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<MatchProps[]>([]);
  const [firstTeamScore, setFirstTeamScore] = useState("");
  const [secondTeamScore, setSecondTeamScore] = useState("");

  const fetchMatches = async () => {
    if (!pollId) {
      toast.show({
        title: "Ops!",
        description: "Não foi possível carregar os jogos do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
      return;
    }

    try {
      setIsLoading(true);
      const matchesResponse = await api.get(`polls/${pollId}/matches`);
      setMatches(matchesResponse.data.matches);
    } catch (error: any) {
      toast.show({
        title: "Ops!",
        description: "Não foi possível carregar os jogos do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setGuess = async (matchId: string) => {
    console.log(pollId, matchId, firstTeamScore, secondTeamScore);

    if (!pollId) {
      toast.show({
        title: "Ops!",
        description: "Não foi possível enviar a sua aposta.",
        placement: "top",
        bgColor: "red.500",
      });
      return;
    }

    if (!firstTeamScore.trim() || !secondTeamScore.trim()) {
      toast.show({
        title: "Ops!",
        description: "Preencha os placares para enviar a sua aposta.",
        placement: "top",
        bgColor: "red.500",
      });
      return;
    }

    try {
      setIsLoading(true);
      await api.post("guesses/", {
        matchId,
        pollId,
        firstTeamScore: Number(firstTeamScore),
        secondTeamScore: Number(secondTeamScore),
      });

      toast.show({
        title: "Sucesso!",
        description: "Aposta enviada com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      fetchMatches();
    } catch (error: any) {
      console.log(error);

      toast.show({
        title: "Ops!",
        description: "Não foi possível enviar a sua aposta.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [pollId]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Match
              data={item}
              setFirstTeamScore={setFirstTeamScore}
              setSecondTeamScore={setSecondTeamScore}
              onGuessConfirm={() => setGuess(item.id)}
            />
          )}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => (
            <EmptyMyPoolList code={code} onShare={onShare} />
          )}
        />
      )}
    </>
  );
}
