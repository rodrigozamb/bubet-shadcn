"use client"

import Image from "next/image";
import BUBetlogo from "../public/logoRetoSemSombra2.png"
import { NavigationMenuLandingPage } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/button";

import p1 from "@/public/prints/p1.png"
import bemvindo from "@/public/bemvindo.png"
import bubetlogo from '@/public/logoRetoSemSombra2.png'
import { useRouter } from "next/navigation";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaGithub } from 'react-icons/fa';



export default function Home() {

  const router = useRouter()

  return (
    <div className="flex flex-col bg-blue-900">
      <title>BUBet | Apostas em BU</title>
      <meta name="landing-page" content="Bem vindo ao BUBet"/>

      <div className="flex justify-center my-10">
        <div className="flex justify-between bg-blue-950 w-7xl h-20 px-15 py-3 rounded-3xl">
          <div className="flex">
            <Image className="" src={BUBetlogo.src} alt="BUBet logo" width={100} height={100}/>
            <NavigationMenuLandingPage />
          </div>

          <div className="flex justify-center items-center">
            <Button className="w-25 h-12 cursor-pointer bg-yellow-500 hover:bg-yellow-600 font-extrabold"
              onClick={()=>{ router.push(`/login`)}}
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">


        <div className="relative flex justify-center z-6 top-10">
          <Image src={bemvindo.src} alt="bemvindo" width={700} height={700}/>
        </div>

        <div>

          <div className="relative flex justify-center z-4">
            <Image className="shadow-2xl rounded-3xl" src={p1.src} alt="p1" width={1000} height={1000}/>
          </div>
        </div>

        <div className="relative flex justify-center z-5 bottom-50 ">
          <Image className="" src={bubetlogo.src} alt="bubetlogo" width={500} height={500}/>
        </div>

      </div>

      <div className=" flex justify-center bg-blue-900 mb-25">
        <div className="flex justify-center flex-col text-center text-white">
          <span className=" text-6xl font-extrabold my-6">O que é a BUBet?</span>
          <div className="flex flex-col text-xl w-250 font-medium">
            <span>A BUBet é um projeto independente que busca divulgar e enaltecer Baterias Universitários e seus Campeonatos ao redor de todo o Brasil.</span>
            <span>Trata-se de uma plataforma de apostas em Baterias Universitárias ( BUs ) em diversos campeonatos, como esse projeto é apenas uma brincadeira, não utilizamos nenhuma forma de monetização durante seu uso.</span>
            <span>Aposte, com pontos da plataforma, na sua BU do coração, mostre sua torcida e ganhe pontos para se tornar o Rank 1 da BUBet. Quem vai levar o estandarte de repique? e o de tamborim? quem será a campeã do Intermed? e da TABU?</span>
            <span className="my-6 text-2xl font-bold">Chame os amigos pra ver quem realmente entende de BU!!!</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-blue-900 my-25">
        <div className="flex justify-center flex-col text-center text-white">
          <span className=" text-6xl font-extrabold my-6">Quem está por trás do BUBet?</span>
          <div className="flex flex-col text-xl w-250 font-medium">
            <span>A BUBet é uma plataforma de batuqueiros feita por batuqueiros para batuqueiros.</span>
            <div>
              <span>Esta plataforma foi idealizada e desenvolvida por </span>
              <a className="font-bold mx-2" href="https://www.linkedin.com/in/rodrigozamboni/" target="_blank"> Rodrigo Zamboni</a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-blue-900mt-25 mb-10">
        <div className="flex justify-center flex-col text-center text-white">
          <span className=" text-6xl font-extrabold my-6">Entre em contato</span>
          <div className="flex flex-col text-xl w-250 font-medium">
            <span>Tem alguma sugestão/reclamação/comentário?</span>
            <span>Fique a vontade para entrar em contato nas redes sociais abaixo</span>
            <div className="flex justify-center m-4">
              <a
                href="https://www.instagram.com/rodrigozamboni_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className=" text-gray-100 hover:text-white text-2xl mx-3"
              >
                <FaInstagram size={36} />
              </a>

              <a
                href="https://www.linkedin.com/in/rodrigozamboni/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linkedin"
                className=" text-gray-100 hover:text-white text-2xl mx-3 "
              >
                <FaLinkedin size={36} />
              </a>

              <a
                href="https://github.com/rodrigozamb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className=" text-gray-100 hover:text-white text-2xl mx-3"
              >
                <FaGithub size={36} />
              </a>

              <a
                href="https://wa.me/5534992966159"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Whatsapp"
                className=" text-gray-100 hover:text-white text-2xl mx-3"
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
