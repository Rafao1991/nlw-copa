import Image from "next/image";
import { FormEvent, useState } from "react";

import appPreview from "../assets/aplicacao-trilha-ignite.png";
import avatar from "../assets/avatares.png";
import icon from "../assets/icon.svg";
import logo from "../assets/logo.svg";
import api from "../lib/axios";

interface HomeProps {
  guessesCount: number;
  poolsCount: number;
  usersCount: number;
}

const getCountData = async () => {
  const response = await Promise.all([
    api.get("guesses/count"),
    api.get("pools/count"),
    api.get("users/count"),
  ]);

  return response;
};

export default function Home({
  guessesCount,
  poolsCount,
  usersCount,
}: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const createPool = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("pools/", { title: poolTitle });
      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência!"
      );
      setPoolTitle("");
    } catch (error) {
      alert("Ocorreu um erro ao criar o bolão, tente novamente mais tarde!");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen grid grid-cols-2 items-center mx-auto">
      <main>
        <Image src={logo} alt="logo" quality={100} />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image
            src={avatar}
            alt="Imagem de quatro pessoas que já estão usando."
            quality={100}
          />
          <p className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{usersCount}</span> pessoas já
            estão usando
          </p>
        </div>
        <form className="mt-10 flex items-center gap-2" onSubmit={createPool}>
          <input
            type="text"
            placeholder="Qual nome do seu bolão?"
            required
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-700 text-sm text-gray-100"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />
          <input
            type="submit"
            value="criar MEU BOLÃO"
            className="px-6 py-4 bg-yellow-500 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-600 cursor-pointer"
          />
        </form>
        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={icon} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={icon} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreview}
        alt="Dois celulares exibindo o app mobile do NLW Copa."
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [guessesResponse, poolsResponse, usersResponse] = await getCountData();

  return {
    props: {
      guessesCount: guessesResponse.data.count,
      poolsCount: poolsResponse.data.count,
      usersCount: usersResponse.data.count,
    },
  };
};
