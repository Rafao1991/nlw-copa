import { Button, HStack, Text, useTheme, VStack } from "native-base";
import { X, Check } from "phosphor-react-native";
import { getName } from "country-list";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { Team } from "./Team";

interface GuessProps {
  id: string;
  matchId: string;
  createdAt: string;
  participantId: string;
  firstTeamScore: number;
  secondTeamScore: number;
}

export interface MatchProps {
  id: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: null | GuessProps;
  date: Date;
}

interface Props {
  data: MatchProps;
  onGuessConfirm: () => void;
  setFirstTeamScore: (value: string) => void;
  setSecondTeamScore: (value: string) => void;
}

export function Match({
  data,
  setFirstTeamScore,
  setSecondTeamScore,
  onGuessConfirm,
}: Props) {
  const { colors, sizes } = useTheme();

  const when = dayjs(data.date)
    .locale("pt-br")
    .format("DD [de] MMMM [de] YYYY [às] HH:mm");

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.firstTeamCountryCode)} vs.{" "}
        {getName(data.secondTeamCountryCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {when}
      </Text>

      <HStack
        mt={4}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Team
          code={data.firstTeamCountryCode}
          position="right"
          onChangeText={setFirstTeamScore}
          score={data.guess?.firstTeamScore.toString()}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.secondTeamCountryCode}
          position="left"
          onChangeText={setSecondTeamScore}
          score={data.guess?.secondTeamScore.toString()}
        />
      </HStack>

      {!data.guess && (
        <Button
          size="xs"
          w="full"
          bgColor="green.500"
          mt={4}
          onPress={onGuessConfirm}
        >
          <HStack alignItems="center">
            <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
              CONFIRMAR PALPITE
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      )}
    </VStack>
  );
}
