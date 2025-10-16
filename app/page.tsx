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

      <div className="flex justify-center my-10">
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
          <Image src={bemvindo.src} alt="bemvindo" width={700} height={700} />
        </div>
        <div className="relative flex justify-center">
          <Image src={bubetlogo.src} alt="bubetlogo" width={500} height={500} />
        </div>
        <div className="justify-center flex mt-30">
          <h1 className="text-yellow-400 font-extrabold text-3xl">
            A plataforma feita por batuqueiros para batuqueiros!
          </h1>
        </div>
      </div>

      {/* Seção O que é a BUBet? */}
      <div id="sobre-nos" className="flex bg-white p-20">
        <div className="flex flex-col">
          <span className="text-6xl mb-6 text-blue-900 font-extrabold">O que é a BUBet?</span>
          <div>
            <div className="text-2xl mb-8 max-w-400">
              A BUBet é um projeto independente que busca divulgar e enaltecer Baterias Universitários e seus Campeonatos ao redor de todo o Brasil. Trata-se de uma plataforma de apostas em Baterias Universitárias (BUs) em diversos campeonatos, como esse projeto é apenas uma brincadeira, não utilizamos nenhuma forma de monetização durante seu uso.
            </div>
            <div className="text-xl max-w-300">
              Aposte, com pontos da plataforma, na sua BU do coração, mostre sua torcida e ganhe pontos para se tornar o Rank 1 da BUBet. <span className="font-bold text-blue-900">Chame os amigos pra ver quem realmente entende de BU!!!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Quem está por trás do BUBet? */}
      <div id="como-apostar" className="flex justify-end bg-blue-900 p-20">
        <div className="flex flex-col text-center text-white">
          <span className=" text-6xl justify-end text-right font-extrabold mb-6">Quem está por trás do BUBet?</span>
          <div className="text-2xl justify-end text-right">
            <span>Esta plataforma foi idealizada e desenvolvida por: </span>
            <a className="font-bold text-yellow-400" href="https://www.linkedin.com/in/rodrigozamboni/" target="_blank">Rodrigo Zamboni</a>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-blue-900 p-20">
        <div className="flex justify-center flex-col text-center text-white">
          <div className="flex flex-col text-xl">
            <div>Tem alguma sugestão/reclamação/comentário?</div>
            <div>Entre em contato com a gente pelas redes sociais abaixo</div>
            <div className="flex justify-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/rodrigozamboni_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-yellow-400 text-gray-100 text-2xl"
              >
                <FaInstagram size={36} />
              </a>
              <a
                href="https://www.linkedin.com/in/rodrigozamboni/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linkedin"
                className="hover:text-yellow-400 text-gray-100 text-2xl"
              >
                <FaLinkedin size={36} />
              </a>
              <a
                href="https://github.com/rodrigozamb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="hover:text-yellow-400 text-gray-100 text-2xl"
              >
                <FaGithub size={36} />
              </a>
              <a
                href="https://wa.me/5534992966159"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Whatsapp"
                className="hover:text-yellow-400 text-gray-100 text-2xl"
              >
                <FaWhatsapp size={36} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
