import { Avatar, Center, HStack, Text } from "native-base";

export interface ParticipantProps {
  user: {
    avatar: string;
  };
}

interface Props {
  participants: ParticipantProps[];
  count: number;
}

export function Participants({ participants, count }: Props) {
  return (
    <HStack>
      {participants &&
        participants.map((participant, index) => (
          <Avatar
            key={`${participant.user.avatar}-${index}`}
            source={{ uri: participant.user.avatar }}
            w={8}
            h={8}
            rounded="full"
            borderWidth={2}
            marginRight={-3}
            borderColor="gray.800"
          />
        ))}

      <Center
        w={8}
        h={8}
        bgColor="gray.700"
        rounded="full"
        borderWidth={1}
        borderColor="gray.800"
      >
        <Text color="gray.100" fontSize="xs" fontFamily="medium">
          {count ? `+${count}` : 0}
        </Text>
      </Center>
    </HStack>
  );
}
