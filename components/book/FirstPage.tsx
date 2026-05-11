/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


interface FirstPageProps {
    item:{
        id: string
        title: string
    },
    stickers:{
        name: string,
        url: string,
        naipe: string
    }[],
    special_photo: string
}

export function FirstPage( {item, stickers, special_photo}: FirstPageProps ) {

    return (
        <>
        <div className="page bg-blue-200 text-black p-4" key={item.id}>
              <div className="page-content">
                <h2>{item.title}</h2>
                <div className="image-gallery">
                  <div className="flex justify-between items-center ">
                    <p className="text-center font-lightp-3">{item.title}</p>
                    <div className="bg-gray-400 h-25 w-30 rounded flex items-center justify-center">Image 1</div>
                  </div>
                  {/* Placeholder for images */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 1</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 2</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 3</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 4</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 1</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 2</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 3</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 4</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 4</div>
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}
