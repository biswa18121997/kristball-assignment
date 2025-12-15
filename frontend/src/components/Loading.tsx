

function Loading(){

// Loading Screen Animated component

    return(<div className="w-screen h-screen bg-neutral-950/80 p-1 flex flex-col justify-center items-center">


        <div className="w-[100px] h-[100px] border-t-2 border-r-2 animate-spin border-white rounded-full flex justify-center items-center">
         <i className="fa-solid fa-spinner animate-spin text-amber-400 text-3xl "></i>
        </div>       
        
        <h1 className="text-white" >Loading...!!</h1>
        <h1 className="text-green-500">Plaese Wait....and be Patient..</h1>
        



    </div>)
}

export default Loading