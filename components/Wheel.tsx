/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRef, useState } from "react";

import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { api } from "@/services/api";
import { Bounce, toast } from "react-toastify";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
export default function SpinWheel() {


    const router = useRouter()
    const { width, height } = useWindowSize()
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);


    const wheelRef = useRef<HTMLDivElement | null>(null);
    const colors: string[] = ["#db7093","#20b2aa", "#d63e92","#daa520","#dd340f","#ff7f50","#3cb371","#4169e1"];
    const titles = {
      "1":"Bom, pelo menos é melhor que nada... 💀",
      "5":"Pelo menos não foi 1% né? 🥸🥸",
      "10":"10% a mais pode fazer muita diferença!! 🙏🏻🙏🏻",
      "15":"🎉🎉 Parabéns!!! 🎉🎉",
      "20":"Eita!! 20% a mais de pontos na sua aposta! 👍🏻👍🏻",
      "25":"Caramba!! Você ganhou um cupom de 25% ✨✨",
      "50":"SORTUDO!! Ganhou um cupom de 50% 🔥🔥",
      "100":"UAUUU!! VOCÊ TEM MUITA SORTE!!🎉🎉"
    }
  
    const prizes = [100, 1, 50, 15, 25, 10, 5, 20];

    const SPIN_DURATION = 5000; // must match CSS

    const handleSpin = async () => {
      if (!wheelRef.current || spinning) return;

      setSpinning(true);
      setWinner(null);

      try{

        // 1. Ask backend to spin
        const res = await api.post(`/cupons`)
        const data = res.data;
        
  
        const { angle, prize } = data;  
  
        // 2. Animate wheel (visual only)
        wheelRef.current.style.transform = `rotate(${angle}deg)`;
  
        // 3. Reveal result after animation
        setTimeout(() => {
          setWinner(prize);
          setOpenDialog(true);
          setSpinning(false);
        }, SPIN_DURATION);
      }catch(error: any){
        
        setTimeout(() => {
          setSpinning(false);
        }, SPIN_DURATION);

        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })

      }
    };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col mb-15 text-center">
        <span className="font-extrabold text-4xl mb-5">Roleta de Cupons</span>
        <div className="text-center w-150 ">Rode a roleta para conseguir cupons que aumentarão a porcentagem de pontos que você ganhará em uma aposta!! </div>
        <div className="text-center w-150 ">
            <span>Você pode rolar a roleta </span>
            <span className="font-bold">1 vez</span>
            <span> a cada 7 dias.</span>

        </div>
      </div>
      <div className="relative w-[400px] h-[400px] flex items-center justify-center">
        {/* BOTÃO */}
        <div
        onClick={handleSpin}
        className={`spinBttn absolute z-10 w-[60px] h-[60px] bg-white rounded-full
            flex items-center justify-center select-none
            font-semibold text-[#333] tracking-[0.1em]
            border-[4px] border-[rgba(0,0,0,0.75)] text-sm
            ${spinning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        >
        GIRAR
        </div>


        {/* RODA */}
        <div
          ref={wheelRef}
          className="wheel absolute top-0 left-0 w-full h-full rounded-full overflow-hidden"
        >
            {

                prizes.map((pr,i)=>{
                    return(
                        <div className="number" key={i} style={{ "--i": i+1, "--clr": colors[i] } as any}>
                            <span>{pr}%</span>
                        </div>
                    )
                })
            }

        </div>

        {/* CSS ESPECÍFICO DA ROLETA */}
        <style jsx>{`
          .spinBttn::before {
            content: "";
            position: absolute;
            top: -28px;
            width: 20px;
            height: 30px;
            background: white;
            clip-path: polygon(50% 0%, 15% 100%, 85% 100%);
          }

          .wheel {
            background: #333;
            box-shadow: 0 0 0 5px #333, 0 0 0 15px #fff,
              0 0 0 18px #111;
            transition: transform 5s ease-in-out;
          }

          .number {
            position: absolute;
            width: 50%;
            height: 50%;
            background: var(--clr);
            transform-origin: bottom right;
            transform: rotate(calc(45deg * var(--i)));
            clip-path: polygon(0 0, 56% 0, 100% 100%, 0 56%);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }

          .number span {
            transform: rotate(45deg);
            font-size: 2em;
            font-weight: 700;
            color: white;
            text-shadow: 3px 5px 2px rgba(0, 0, 0, 0.15);
            position: relative;
          }

          .number span::before {
            content: "";
            position: absolute;
            font-size: 0.75em;
            font-weight: 500;
          }
        `}</style>
      </div>
        
        {
          winner !== null && 
        
          <div>
            <Confetti width={width} height={height} />
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center">{titles[winner.toString() as keyof typeof titles] || "Parabéns!"}</DialogTitle>
                  <DialogDescription className="text-lg mt-2 text-center">
                    Você ganhou um cupom de <span className="font-bold">{winner}%</span> para aumentar os pontos de uma aposta!!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex align-center justify-center my-4">
                    <div className=" relative w-[360px] h-[180px] bg-orange-400 rounded-md shadow-lg overflow-hidden">
                    {/* Recortes laterais */}
                    <div className="ticket-cut left-0" />
                    <div className="ticket-cut right-0" />

                    {/* Borda interna */}
                    <div className="absolute inset-3 border-2 border-orange-600 rounded-sm flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-bold tracking-widest text-yellow-100">
                        CUPOM {winner}% 
                        </h1>

                        {/* Linha inferior */}
                        <div className="mt-4 flex gap-2 text-yellow-200">
                        ★ ★ ★ ★ ★ ★ ★
                        </div>
                    </div>

                    <style jsx>{`
                        .ticket-cut {
                        position: absolute;
                        top: 50%;
                        width: 32px;
                        height: 32px;
                        background: white;
                        border-radius: 50%;
                        transform: translateY(-50%);
                        z-index: 10;
                        }

                        .ticket-cut.left-0 {
                        left: -16px;
                        }

                        .ticket-cut.right-0 {
                        right: -16px;
                        }
                    `}</style>
                    </div>
                </div>
                
                <div className="flex justify-center ">
                  <Button 
                      className="bg-blue-800 my-10 font-bold h-15 w-50 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                      onClick={()=>{router.push("/dashboard")}}
                  >
                      Usar Cupom
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }

    </div>
  );
}
