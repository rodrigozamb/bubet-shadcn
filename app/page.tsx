/* eslint-disable react/no-unescaped-entities */
"use client"

import Image from "next/image";
import BUBetlogo from "../public/logoRetoSemSombra2.png"
import { NavigationMenuLandingPage } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/button";
import bemvindo from "@/public/bemvindo.png"
import bubetlogo from '@/public/logoRetoSemSombra2.png'
import { useRouter } from "next/navigation";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaGithub } from 'react-icons/fa';

export default function Home() {

  const router = useRouter()

  return (
    <div className="flex flex-col bg-blue-900">
      <title>BUBet | Apostas em BU</title>
      <meta name="landing-page" content="Bem vindo ao BUBet" />

      <div className="flex justify-center mx-5 my-10">
        <div className="flex justify-between bg-blue-950 w-7xl h-20 px-15 py-3 rounded-3xl">
          <div className="flex">
            <Image className="" src={BUBetlogo.src} alt="BUBet logo" width={100} height={100} />
            <div className="flex items-center">
              <NavigationMenuLandingPage />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button
              className="w-25 h-12 cursor-pointer bg-yellow-500 hover:bg-yellow-600 font-extrabold"
              onClick={() => { router.push(`/login`) }}
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col pb-20 pt-10 justify-center">
        <div className="relative flex justify-center">
          <Image src={bemvindo.src} alt="bemvindo" className="px-4" width={700} height={700} />
        </div>
        <div className="relative flex justify-center">
          <Image src={bubetlogo.src} alt="bubetlogo" className="px-4" width={500} height={500} />
        </div>
        <div className="justify-center flex mt-10 md:mt-30 text-center px-4">
          <h1 className="text-yellow-400 font-extrabold text-2xl md:text-3xl">
            A plataforma feita por batuqueiros para batuqueiros!
          </h1>
        </div>
      </div>

      <div id="como-apostar" className="flex bg-white p-10 md:p-20">
        <div className="flex flex-col">
          <span className="text-4xl md:text-6xl mb-6 text-blue-900 font-extrabold">Quero apostar, o que devo fazer?</span>
          <div>
            <div className="text-lg md:text-2xl mb-8">
              É muito simples, basta seguir os seguintes passos:
              <ol className="mb-4 text-base md:text-xl list-disc list-inside mt-4 space-y-2">
                <li>Crie sua conta clicando no botão 'Entrar' no canto superior direito da página inicial.</li>
                <li>Após criar sua conta, faça o login com suas credenciais.</li>
                <li>Explore os campeonatos disponíveis e escolha a Bateria Universitária (BU) na qual deseja apostar.</li>
                <li>Utilize os pontos que você possui na plataforma para fazer suas apostas nas BUs de sua preferência.</li>
                <li>Acompanhe os resultados dos campeonatos e veja como suas apostas se saem!</li>
              </ol>
            </div>
            <div className="text-lg md:text-xl">
              Depois é só se divertir, <span className="font-bold text-blue-900">e boa sorte!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-blue-900 p-10 md:p-20">
        <div className="flex flex-col text-center md:text-right text-white">
          <span className="text-4xl md:text-6xl justify-end text-right font-extrabold mb-6">Preciso pagar para jogar?</span>
          <div className="text-3xl md:text-5xl text-yellow-400 font-extrabold mb-5 justify-end text-right">
            Não!
          </div>
            <div className="text-lg md:text-2xl justify-end text-right">
              A BUBet é uma plataforma 100% gratuita que simulam de apostas fictícias, ou seja, você não precisa pagar nada para participar. As apostas são feitas com pontos da plataforma, que você pode ganhar ao se cadastrar e ao participar das atividades da comunidade. Nosso objetivo é promover a integração, diversão e engajamento entre os apreciadores do movimento Baterias Universitárias,<span className="font-extrabold text-yellow-400"> sem envolver dinheiro real ou transferências bancárias.</span>
          </div>
        </div>
      </div>

      <div className="flex bg-white p-10 md:p-20">
        <div className="flex flex-col">
          <span className="text-4xl md:text-6xl mb-6 text-blue-900 font-extrabold">Como funciona o sistema de pontuação?</span>
          <div>
            <div className="text-lg md:text-2xl mb-4">
              Os pontos adquiridos por acerto são <span className="text-blue-900 font-extrabold">inversamente proporcionais a colocação</span>, por exemplo: <br /> <br />
              Uma competição com 10 BUs, se você acertar a campeã, você ganha 10 pontos. Se acertar a vice-campeã, ganha 9 pontos. E assim por diante, até a 10ª colocada, que vale 1 ponto. <br /> <br />
              Quanto aos estandartes, a cada acerto, você ganha 5 pontos fixos, independente da colocação.
            </div>
          </div>
        </div>
      </div>

      <div id="sobre-nos" className="flex justify-end bg-blue-900 p-10 md:p-20">
        <div className="flex flex-col text-white">
          <div className="text-4xl md:text-6xl justify-end text-right font-extrabold mb-6">O que é a BUBet?</div>
            <div className="text-lg md:text-2xl justify-end text-right">
              A BUBet é um projeto independente que busca divulgar e enaltecer Baterias Universitários e seus Campeonatos ao redor de todo o Brasil. Trata-se de uma plataforma de apostas fictícias nos principais campeonatos de Baterias Universitárias (BUs) do país. <br /> <br />
            </div>
            <div className="text-lg md:text-2xl justify-end text-right">
              Aposte, com pontos da plataforma, na sua BU do coração, mostre sua torcida e ganhe pontos para se tornar o Rank 1 da BUBet. <br /><span className="font-bold text-yellow-400">Chame os amigos pra ver quem realmente entende de BU!!!</span>
            </div>
        </div>
      </div>

      <div className="flex bg-white p-10 md:p-20">
        <div className="flex flex-col">
          <span className="text-4xl md:text-6xl text-blue-900 text-left font-extrabold mb-6">Quem está por trás do BUBet?</span>
          <div className="text-lg md:text-2xl text-left">
            <div className="">Esta plataforma foi idealizada e desenvolvida por: <span className="text-blue-900 font-extrabold">Rodrigo Zamboni, diretor e ritmista das baterias Computaria e Ufuteria</span></div>
          </div>

          <div className="flex  flex-col">
          <div className="flex flex-col text-lg md:text-xl mt-5">
            <div>Tem alguma sugestão/reclamação/comentário? Entre em contato comigo pelas redes sociais a seguir</div>
            <div className="flex  gap-4 mt-6">
              <a
                href="https://www.instagram.com/rodrigozamboni_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-blue-900 text-2xl"
              >
                <FaInstagram size={36} />
              </a>
              <a
                href="https://www.linkedin.com/in/rodrigozamboni/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linkedin"
                className="text-blue-900 text-2xl"
              >
                <FaLinkedin size={36} />
              </a>
              <a
                href="https://github.com/rodrigozamb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="text-blue-900 text-2xl"
              >
                <FaGithub size={36} />
              </a>
              <a
                href="https://wa.me/5534992966159"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Whatsapp"
                className="text-blue-900 text-2xl"
              >
                <FaWhatsapp size={36} />
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}